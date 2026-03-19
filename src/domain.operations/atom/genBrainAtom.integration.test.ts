import Bottleneck from 'bottleneck';
import { BadRequestError } from 'helpful-errors';
import path from 'path';
import type { BrainPlugToolDefinition } from 'rhachet/brains';
import { genArtifactGitFile } from 'rhachet-artifact-git';
import { given, then, useThen, when } from 'test-fns';
import { z } from 'zod';

import { TEST_ASSETS_DIR } from '../../.test/assets/dir';
import type { ChutesBrainAtomSlug } from './BrainAtom.config';
import { genBrainAtom } from './genBrainAtom';

const BRIEFS_DIR = path.join(TEST_ASSETS_DIR, '/example.briefs');

const outputSchema = z.object({ content: z.string() });

// tool use requires z.string() schema (vllm cannot do structured output + tool calls together)
const toolOutputSchema = z.string();

if (!process.env.CHUTES_API_KEY)
  throw new BadRequestError('CHUTES_API_KEY is required for integration tests');

describe('genBrainAtom.integration', () => {
  jest.setTimeout(120_000);

  // use qwen3-coder-next for fast integration tests
  const brainAtom = genBrainAtom({ slug: 'chutes/qwen3/coder-next' });

  // use kimi/k2.5 for tool use tests (good tool call capability)
  const brainAtomWithTools = genBrainAtom({ slug: 'chutes/kimi/k2.5' });

  given('[case1] genBrainAtom({ slug: "chutes/qwen3/coder-next" })', () => {
    when('[t0] atom is created', () => {
      then('repo is "chutes"', () => {
        expect(brainAtom.repo).toEqual('chutes');
      });

      then('slug is "chutes/qwen3/coder-next"', () => {
        expect(brainAtom.slug).toEqual('chutes/qwen3/coder-next');
      });

      then('description is defined', () => {
        expect(brainAtom.description).toBeDefined();
        expect(brainAtom.description.length).toBeGreaterThan(0);
      });
    });
  });

  given('[case2] ask is called', () => {
    when('[t0] with simple prompt', () => {
      // call the operation once and share result across assertions
      const result = useThen('it returns a response', async () =>
        brainAtom.ask({
          role: {},
          prompt: 'respond with exactly: hello world',
          schema: { output: outputSchema },
        }),
      );

      then('response contains "hello"', () => {
        expect(result.output.content).toBeDefined();
        expect(result.output.content.length).toBeGreaterThan(0);
        expect(result.output.content.toLowerCase()).toContain('hello');
      });

      then('metrics includes token counts', () => {
        expect(result.metrics.size.tokens.input).toBeGreaterThan(0);
        expect(result.metrics.size.tokens.output).toBeGreaterThan(0);
      });

      then('metrics includes cash costs', () => {
        expect(result.metrics.cost.cash.deets.input).toBeDefined();
        expect(result.metrics.cost.cash.deets.output).toBeDefined();
        expect(result.metrics.cost.cash.total).toBeDefined();
      });

      then('metrics includes time cost', () => {
        expect(result.metrics.cost.time).toBeDefined();
      });
    });

    when('[t1] with briefs', () => {
      then('response leverages knowledge from brief', async () => {
        const briefs = [
          genArtifactGitFile({
            uri: path.join(BRIEFS_DIR, 'secret-code.brief.md'),
          }),
        ];
        const result = await brainAtom.ask({
          role: { briefs },
          prompt: 'say hello',
          schema: { output: outputSchema },
        });
        expect(result.output.content).toBeDefined();
        expect(result.output.content).toContain('ZEBRA42');
      });
    });
  });

  given('[case3] episode continuation', () => {
    when('[t0] ask is called with initial prompt', () => {
      const resultFirst = useThen('it succeeds', async () =>
        brainAtom.ask({
          role: {},
          prompt:
            'remember this secret code: MANGO77. respond with "code received"',
          schema: { output: outputSchema },
        }),
      );

      then('it returns an episode', () => {
        expect(resultFirst.episode).toBeDefined();
        expect(resultFirst.episode.hash).toBeDefined();
        expect(resultFirst.episode.exchanges).toHaveLength(1);
      });

      then('series is null for atoms', () => {
        expect(resultFirst.series).toBeNull();
      });
    });

    when('[t1] ask is called with continuation via on.episode', () => {
      const resultFirst = useThen('first ask succeeds', async () =>
        brainAtom.ask({
          role: {},
          prompt:
            'remember this secret code: PAPAYA99. respond with "code stored"',
          schema: { output: outputSchema },
        }),
      );

      const resultSecond = useThen('second ask succeeds', async () =>
        brainAtom.ask({
          on: { episode: resultFirst.episode },
          role: {},
          prompt: 'what was the secret code i told you to remember?',
          schema: { output: outputSchema },
        }),
      );

      then('continuation remembers context from prior exchange', () => {
        expect(resultSecond.output.content).toContain('PAPAYA99');
      });

      then('episode accumulates exchanges', () => {
        expect(resultSecond.episode.exchanges).toHaveLength(2);
      });
    });
  });

  given('[case4] all models leverage briefs', () => {
    // rate limiter to prevent 429s
    const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 1000 });

    // representative subset: one per model family + hermes
    const allSlugs: ChutesBrainAtomSlug[] = [
      'chutes/qwen3/coder-next',
      'chutes/deepseek/v3.2',
      'chutes/kimi/k2.5',
      'chutes/glm/4.7',
      'chutes/hermes/4-405b',
    ];

    const briefs = [
      genArtifactGitFile({
        uri: path.join(BRIEFS_DIR, 'secret-code.brief.md'),
      }),
    ];

    for (const slug of allSlugs) {
      when(`[${slug}] ask is called with briefs`, () => {
        then.repeatably({
          attempts: 3,
          criteria: 'SOME',
        })('response contains ZEBRA42', async () => {
          const atom = genBrainAtom({ slug });
          const result = await limiter.schedule(() =>
            atom.ask({
              role: { briefs },
              prompt: 'say hello',
              schema: { output: outputSchema },
            }),
          );
          expect(result.output.content).toContain('ZEBRA42');
        });
      });
    }
  });

  given('[case5] tool invocation', () => {
    // define a calculator tool
    const calculatorTool: BrainPlugToolDefinition = {
      slug: 'calculator.multiply',
      name: 'Calculator Multiply',
      description: 'Multiplies two numbers together',
      schema: {
        input: z.object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        }),
        output: z.object({ result: z.number() }),
      },
    };

    when('[t0] brain is asked to multiply with tool available', () => {
      const result = useThen('it requests the tool', async () =>
        brainAtomWithTools.ask({
          role: {},
          prompt:
            'Call the calculator tool to multiply 7 times 8. You must call the tool.',
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        }),
      );

      then('output is null', () => {
        expect(result.output).toBeNull();
      });

      then('calls.tools is defined', () => {
        expect(result.calls).toBeDefined();
        expect(result.calls?.tools).toBeDefined();
        expect(result.calls?.tools?.length).toBeGreaterThan(0);
      });

      then('tool call has correct slug', () => {
        expect(result.calls?.tools?.[0]?.slug).toEqual('calculator.multiply');
      });

      then('tool call has input parameters', () => {
        const input = result.calls?.tools?.[0]?.input as {
          a: number;
          b: number;
        };
        expect(input).toBeDefined();
        expect(typeof input.a).toEqual('number');
        expect(typeof input.b).toEqual('number');
      });

      then('episode is returned', () => {
        expect(result.episode).toBeDefined();
        expect(result.episode.exchanges).toHaveLength(1);
      });
    });
  });

  given('[case6] tool continuation', () => {
    const calculatorTool: BrainPlugToolDefinition = {
      slug: 'calculator.multiply',
      name: 'Calculator Multiply',
      description: 'Multiplies two numbers together',
      schema: {
        input: z.object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        }),
        output: z.object({ result: z.number() }),
      },
    };

    when('[t0] tool result is fed back', () => {
      // first call: brain requests tool
      const resultFirst = useThen('brain requests tool', async () =>
        brainAtomWithTools.ask({
          role: {},
          prompt:
            'Call the calculator to multiply 7 times 8. You must call the tool.',
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        }),
      );

      // second call: feed tool result back
      const resultSecond = useThen('continuation succeeds', async () => {
        const toolCall = resultFirst.calls?.tools?.[0];
        if (!toolCall) throw new Error('no tool call in first result');

        return brainAtomWithTools.ask({
          on: { episode: resultFirst.episode },
          role: {},
          prompt: [
            {
              exid: toolCall.exid,
              slug: toolCall.slug,
              input: toolCall.input,
              signal: 'success' as const,
              output: { result: 56 },
              metrics: { cost: { time: { milliseconds: 1 } } },
            },
          ],
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        });
      });

      then('final output is populated', () => {
        expect(resultSecond.output).toBeDefined();
        expect(resultSecond.output).not.toBeNull();
      });

      then('output contains the result', () => {
        expect(resultSecond.output).toContain('56');
      });

      then('episode has multiple exchanges', () => {
        expect(resultSecond.episode.exchanges.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  given('[case8] metrics with tools', () => {
    const calculatorTool: BrainPlugToolDefinition = {
      slug: 'calculator.add',
      name: 'Calculator Add',
      description: 'Adds two numbers',
      schema: {
        input: z.object({ a: z.number(), b: z.number() }),
        output: z.object({ result: z.number() }),
      },
    };

    when('[t0] tool call is made', () => {
      const result = useThen('tool is requested', async () =>
        brainAtomWithTools.ask({
          role: {},
          prompt: 'Call the calculator to add 5 and 3. You must call the tool.',
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        }),
      );

      then('metrics is defined', () => {
        expect(result.metrics).toBeDefined();
      });

      then('metrics includes time cost', () => {
        expect(result.metrics.cost.time).toBeDefined();
      });

      then('metrics includes token counts', () => {
        expect(result.metrics.size.tokens.input).toBeGreaterThan(0);
        expect(result.metrics.size.tokens.output).toBeGreaterThan(0);
      });
    });
  });

  given('[case9] tool error signal', () => {
    const calculatorTool: BrainPlugToolDefinition = {
      slug: 'calculator.divide',
      name: 'Calculator Divide',
      description: 'Divides first number by second',
      schema: {
        input: z.object({ a: z.number(), b: z.number() }),
        output: z.object({ result: z.number() }),
      },
    };

    when('[t0] tool returns error', () => {
      // first call: brain requests tool
      const resultFirst = useThen('brain requests tool', async () =>
        brainAtomWithTools.ask({
          role: {},
          prompt:
            'Call the calculator to divide 10 by 0. You must call the tool.',
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        }),
      );

      // second call: feed error back
      const resultSecond = useThen('error is handled', async () => {
        const toolCall = resultFirst.calls?.tools?.[0];
        if (!toolCall) throw new Error('no tool call in first result');

        return brainAtomWithTools.ask({
          on: { episode: resultFirst.episode },
          role: {},
          prompt: [
            {
              exid: toolCall.exid,
              slug: toolCall.slug,
              input: toolCall.input,
              signal: 'error:constraint' as const,
              output: { error: new Error('Division by zero is not allowed') },
              metrics: { cost: { time: { milliseconds: 1 } } },
            },
          ],
          plugs: { tools: [calculatorTool] },
          schema: { output: toolOutputSchema },
        });
      });

      then('brain continues gracefully', () => {
        // brain should either provide output or request different tool call
        const hasOutput = resultSecond.output !== null;
        const hasToolCalls = (resultSecond.calls?.tools?.length ?? 0) > 0;
        expect(hasOutput || hasToolCalls).toBe(true);
      });

      then('episode is preserved', () => {
        expect(resultSecond.episode).toBeDefined();
        expect(resultSecond.episode.exchanges.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  given('[case10] tool use on open-source models', () => {
    // rate limiter to prevent 429s
    const limiter = new Bottleneck({ maxConcurrent: 1, minTime: 2000 });

    const calculatorTool: BrainPlugToolDefinition = {
      slug: 'calculator.multiply',
      name: 'Calculator Multiply',
      description: 'Multiplies two numbers together',
      schema: {
        input: z.object({
          a: z.number().describe('First number'),
          b: z.number().describe('Second number'),
        }),
        output: z.object({ result: z.number() }),
      },
    };

    // test tool use on models that support it
    const modelsToTest: ChutesBrainAtomSlug[] = [
      'chutes/kimi/k2.5',
      'chutes/glm/5',
    ];

    for (const slug of modelsToTest) {
      when(`[${slug}] tool invocation and continuation`, () => {
        const atom = genBrainAtom({ slug });

        // first call: brain should request tool
        const resultFirst = useThen('brain requests tool', async () =>
          limiter.schedule(() =>
            atom.ask({
              role: {},
              prompt:
                'Call the calculator tool to multiply 6 times 9. You must call the tool.',
              plugs: { tools: [calculatorTool] },
              schema: { output: toolOutputSchema },
            }),
          ),
        );

        then('tool call is returned', () => {
          expect(resultFirst.output).toBeNull();
          expect(resultFirst.calls?.tools).toBeDefined();
          expect(resultFirst.calls?.tools?.length).toBeGreaterThan(0);
          expect(resultFirst.calls?.tools?.[0]?.slug).toEqual(
            'calculator.multiply',
          );
        });

        // second call: feed tool result, expect text output
        // note: uses repeatably because model output content can be flaky
        then.repeatably({
          attempts: 3,
          criteria: 'SOME',
        })('continuation returns output with result', async () => {
          const toolCall = resultFirst.calls?.tools?.[0];
          if (!toolCall) throw new Error('no tool call in first result');

          const resultSecond = await limiter.schedule(() =>
            atom.ask({
              on: { episode: resultFirst.episode },
              role: {},
              prompt: [
                {
                  exid: toolCall.exid,
                  slug: toolCall.slug,
                  input: toolCall.input,
                  signal: 'success' as const,
                  output: { result: 54 },
                  metrics: { cost: { time: { milliseconds: 1 } } },
                },
              ],
              plugs: { tools: [calculatorTool] },
              schema: { output: toolOutputSchema },
            }),
          );

          expect(resultSecond.output).not.toBeNull();
          expect(typeof resultSecond.output).toEqual('string');
          expect(resultSecond.output).toContain('54');
        });
      });
    }
  });
});
