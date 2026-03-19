import { BadRequestError } from 'helpful-errors';
import OpenAI from 'openai';
import {
  BrainAtom,
  type BrainEpisode,
  BrainOutput,
  BrainOutputMetrics,
  type BrainPlugs,
  type BrainPlugToolExecution,
  calcBrainOutputCost,
  castBriefsToPrompt,
  genBrainContinuables,
} from 'rhachet/brains';
import type { Artifact } from 'rhachet-artifact';
import type { GitFile } from 'rhachet-artifact-git';
import type { Empty } from 'type-fns';
import { z } from 'zod';

import { castContentToOutputSchema } from '../../infra/cast/castContentToOutputSchema';
import { castFromChutesToolCall } from '../../infra/cast/castFromChutesToolCall';
import { castIntoChutesToolDef } from '../../infra/cast/castIntoChutesToolDef';
import { castIntoChutesToolMessages } from '../../infra/cast/castIntoChutesToolMessages';
import {
  type ChutesBrainAtomSlug,
  CONFIG_BY_ATOM_SLUG,
} from './BrainAtom.config';

// re-export for consumers
export type { ChutesBrainAtomSlug } from './BrainAtom.config';

/**
 * .what = factory to generate chutes brain atom instances
 * .why = enables model variant selection via slug
 *
 * .note = chutes api is openai-compatible with baseURL override
 *
 * .example
 *   genBrainAtom({ slug: 'chutes/qwen3/coder-next' })
 *   genBrainAtom({ slug: 'chutes/deepseek/v3.2' }) // fast + cheap
 *   genBrainAtom({ slug: 'chutes/kimi/k2.5' }) // best swe-bench
 */
export const genBrainAtom = (input: {
  slug: ChutesBrainAtomSlug;
}): BrainAtom => {
  const config = CONFIG_BY_ATOM_SLUG[input.slug];

  return new BrainAtom({
    repo: 'chutes',
    slug: input.slug,
    description: config.description,
    spec: config.spec,

    /**
     * .what = stateless inference with optional tool use
     * .why = provides direct model access for tasks
     *
     * .note = supports continuation via `on.episode`
     * .note = supports tool use via `plugs.tools`
     */
    ask: async <TOutput, TPlugs extends BrainPlugs = BrainPlugs>(
      askInput: {
        on?: { episode: BrainEpisode };
        plugs?: TPlugs;
        role: { briefs?: Artifact<typeof GitFile>[] };
        prompt: string | BrainPlugToolExecution[];
        schema: { output: z.Schema<TOutput> };
      },
      context?: Empty,
    ): Promise<BrainOutput<TOutput, 'atom', TPlugs>> => {
      // track start time for elapsed duration
      const startedAt = Date.now();

      // compose system prompt from briefs
      const systemPrompt = askInput.role.briefs
        ? await castBriefsToPrompt({ briefs: askInput.role.briefs })
        : undefined;

      // get openai client from context or create new one with chutes baseURL
      const openai =
        (context?.openai as OpenAI | undefined) ??
        new OpenAI({
          apiKey: process.env.CHUTES_API_KEY,
          baseURL: 'https://llm.chutes.ai/v1/',
          timeout: 60_000,
        });

      // build messages array with prior exchanges for continuation
      const messages: OpenAI.ChatCompletionMessageParam[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      if (askInput.on?.episode) {
        for (const exchange of askInput.on.episode.exchanges) {
          messages.push({ role: 'user', content: exchange.input });
          messages.push({ role: 'assistant', content: exchange.output });
        }
      }

      // build prompt messages based on type (string vs tool executions)
      const promptMessages: OpenAI.ChatCompletionMessageParam[] = (() => {
        if (typeof askInput.prompt === 'string') {
          return [{ role: 'user' as const, content: askInput.prompt }];
        }
        // prompt is tool execution results - cast to openai messages
        return castIntoChutesToolMessages({
          executions: askInput.prompt as BrainPlugToolExecution[],
        });
      })();
      messages.push(...promptMessages);

      // convert zod schema to json schema for structured output
      const jsonSchema = z.toJSONSchema(askInput.schema.output);

      // detect if this is a tool continuation (prompt is tool execution results)
      const isToolContinuation = Array.isArray(askInput.prompt);

      // build tools parameter if tools are plugged and not a continuation
      // (on continuation, model should produce final output, not call more tools)
      const hasTools = askInput.plugs?.tools?.length;

      // fail-fast: tools + structured output schema not supported by most models
      // vllm constraint: "model must not generate both text and tool calls in same generation"
      // when tools are plugged, output schema must be z.string() to allow plain text responses
      if (hasTools && !isToolContinuation) {
        const schemaType = jsonSchema.type;
        if (schemaType !== 'string') {
          throw new BadRequestError(
            `when tools are plugged, output schema must be z.string() (found: ${schemaType}). most open-source models support either tool_calls or structured json, but not both. use z.string() and parse the response yourself if structure is needed.`,
            { schemaType, tools: askInput.plugs?.tools?.map((t) => t.slug) },
          );
        }
      }
      const toolsParam =
        hasTools && !isToolContinuation
          ? {
              tools: askInput.plugs!.tools!.map((tool) =>
                castIntoChutesToolDef({ tool }),
              ),
              tool_choice: 'auto' as const,
            }
          : {};

      // include response_format only when we want structured output (not tool calls)
      // vllm constraint: "model must not generate both text and tool calls in same generation"
      // when response_format is present, model outputs json content, not tool_calls
      // so we omit response_format on initial tool requests to enable tool call
      const wantsToolCalls = hasTools && !isToolContinuation;
      const responseFormatParam = wantsToolCalls
        ? {}
        : {
            response_format: {
              type: 'json_schema' as const,
              json_schema: {
                name: 'response',
                strict: true,
                schema: jsonSchema,
              },
            },
          };

      // call chutes api
      const response = await openai.chat.completions.create({
        model: config.model,
        messages,
        ...toolsParam,
        ...responseFormatParam,
      });

      // extract message from response
      const message = response.choices[0]?.message;
      const content = message?.content ?? '';
      const toolCalls = message?.tool_calls;

      // calculate elapsed time
      const elapsedMs = Date.now() - startedAt;

      // extract token usage from response
      const tokensInput = response.usage?.prompt_tokens ?? 0;
      const tokensOutput = response.usage?.completion_tokens ?? 0;
      const tokensCached =
        (
          response.usage as {
            prompt_tokens_details?: { cached_tokens?: number };
          }
        )?.prompt_tokens_details?.cached_tokens ?? 0;

      // calculate character counts
      const promptLength =
        typeof askInput.prompt === 'string'
          ? askInput.prompt.length
          : JSON.stringify(askInput.prompt).length;
      const charsInput = (systemPrompt?.length ?? 0) + promptLength;
      const charsOutput = content.length;

      // define size for metrics and cost calculation
      const size = {
        tokens: {
          input: tokensInput,
          output: tokensOutput,
          cache: { get: tokensCached, set: 0 },
        },
        chars: {
          input: charsInput,
          output: charsOutput,
          cache: { get: 0, set: 0 },
        },
      };

      // calculate cash costs via rhachet utility
      const { cash } = calcBrainOutputCost({
        for: { tokens: size.tokens },
        with: { cost: { cash: config.spec.cost.cash } },
      });

      // build metrics
      const metrics = new BrainOutputMetrics({
        size,
        cost: {
          time: { milliseconds: elapsedMs },
          cash,
        },
      });

      // determine exchange input/output for continuables
      const exchangeInput =
        typeof askInput.prompt === 'string'
          ? askInput.prompt
          : JSON.stringify(askInput.prompt);
      const exchangeOutput = toolCalls?.length
        ? JSON.stringify(toolCalls)
        : content;

      // build continuables (episode + series) for this invocation
      const { episode, series } = await genBrainContinuables({
        for: { grain: 'atom' },
        on: { episode: askInput.on?.episode ?? null, series: null },
        with: {
          exchange: {
            input: exchangeInput,
            output: exchangeOutput,
            exid: response.id ?? null,
          },
          episode: { exid: response.id ?? null },
        },
      });

      // if tool calls present, return with calls and null output
      if (toolCalls?.length) {
        const toolInvocations = toolCalls.map((call) =>
          castFromChutesToolCall({ call }),
        );
        return new BrainOutput({
          output: null,
          calls: { tools: toolInvocations } as any,
          metrics,
          episode,
          series,
        }) as BrainOutput<TOutput, 'atom', TPlugs>;
      }

      // parse response content based on schema type
      const output = castContentToOutputSchema({
        content,
        schema: askInput.schema.output,
      });

      return new BrainOutput({
        output,
        calls: null as any,
        metrics,
        episode,
        series,
      }) as BrainOutput<TOutput, 'atom', TPlugs>;
    },
  });
};
