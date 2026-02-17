import { asIsoPrice, dividePrice } from 'iso-price';
import { BrainSpec } from 'rhachet';

/**
 * .what = atom config type
 * .why = shared type for model configs
 */
export type BrainAtomConfig = {
  model: string;
  description: string;
  spec: BrainSpec;
};

/**
 * .what = supported chutes atom slugs
 * .why = enables type-safe slug specification with model variants
 */
export type ChutesBrainAtomSlug =
  | 'chutes/qwen3/coder-next'
  | 'chutes/qwen3/coder-480b'
  | 'chutes/qwen3/235b'
  | 'chutes/deepseek/v3.1'
  | 'chutes/deepseek/v3.2'
  | 'chutes/deepseek/r1'
  | 'chutes/kimi/k2-think'
  | 'chutes/kimi/k2.5'
  | 'chutes/glm/4.7'
  | 'chutes/glm/5'
  | 'chutes/hermes/4-405b';

/**
 * .what = model configuration by slug
 * .why = maps slugs to api model names, descriptions, and specs
 *
 * .sources:
 *   - rates: https://pricepertoken.com, https://openrouter.ai/provider/chutes
 *   - models: https://llm.chutes.ai/v1/models
 *   - api docs: https://docs.litellm.ai/docs/providers/chutes
 */
export const CONFIG_BY_ATOM_SLUG: Record<ChutesBrainAtomSlug, BrainAtomConfig> =
  {
    /**
     * qwen3-coder-next
     * .sources:
     *   - rates: https://pricepertoken.com ($0.07/1M input, $0.30/1M output)
     *   - context: 262K (qwen.ai blog)
     *   - swe-bench: 70.6% verified (https://qwen.ai/blog?id=qwen3-coder-next)
     *   - architecture: 80B total, 3B active (moe)
     */
    'chutes/qwen3/coder-next': {
      model: 'Qwen/Qwen3-Coder-Next',
      description: 'qwen3-coder-next - best cost/performance for code (262K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 150, per: { seconds: 1 } },
            latency: { seconds: 0.5 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'), // no cache rate on chutes
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.07', by: 1_000_000 }), // $0.07/1M tokens
            output: dividePrice({ of: '$0.30', by: 1_000_000 }), // $0.30/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 262_000 } }, // 262K context
          grades: { swe: 70.6 }, // 70.6% swe-bench verified
          cutoff: '2025-06-01',
          domain: 'SOFTWARE',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * qwen3-coder-480b
     * .sources:
     *   - rates: https://openrouter.ai/provider/chutes ($0.22/1M input, $0.95/1M output)
     *   - context: 262K
     *   - swe-bench: 69.6% verified
     *   - architecture: 480B total, 35B active (moe)
     */
    'chutes/qwen3/coder-480b': {
      model: 'Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8-TEE',
      description: 'qwen3-coder-480b - large code model (262K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 80, per: { seconds: 1 } },
            latency: { seconds: 1 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.22', by: 1_000_000 }), // $0.22/1M tokens
            output: dividePrice({ of: '$0.95', by: 1_000_000 }), // $0.95/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 262_000 } }, // 262K context
          grades: { swe: 69.6 }, // 69.6% swe-bench verified
          cutoff: '2025-06-01',
          domain: 'SOFTWARE',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * qwen3-235b
     * .sources:
     *   - rates: https://openrouter.ai/provider/chutes ($0.08/1M input, $0.55/1M output)
     *   - context: 262K
     *   - swe-bench: 61.7% (huggingface qwen3-235b model card)
     *   - architecture: 235B total, 22B active (moe)
     */
    'chutes/qwen3/235b': {
      model: 'Qwen/Qwen3-235B-A22B-Instruct-2507-TEE',
      description: 'qwen3-235b - general purpose (262K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 120, per: { seconds: 1 } },
            latency: { seconds: 0.5 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.08', by: 1_000_000 }), // $0.08/1M tokens
            output: dividePrice({ of: '$0.55', by: 1_000_000 }), // $0.55/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 262_000 } }, // 262K context
          grades: { swe: 61.7 }, // 61.7% swe-bench verified
          cutoff: '2025-07-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * deepseek-v3.1
     * .sources:
     *   - rates: https://github.com/rajashekar/llm-chutes ($0.27/1M input, $0.27/1M output)
     *   - context: 128K
     *   - swe-bench: 66.0% (https://api-docs.deepseek.com/updates)
     *   - architecture: 671B total, 37B active (moe)
     */
    'chutes/deepseek/v3.1': {
      model: 'deepseek-ai/DeepSeek-V3.1-TEE',
      description: 'deepseek-v3.1 - frontier open-source (128K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 100, per: { seconds: 1 } },
            latency: { seconds: 1 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
            output: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 128_000 } }, // 128K context
          grades: { swe: 66.0 }, // 66.0% swe-bench verified
          cutoff: '2025-03-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * deepseek-v3.2 (chutes-exclusive)
     * .sources:
     *   - rates: estimated from v3.1 tier ($0.27/1M input, $0.27/1M output)
     *   - context: 128K
     *   - swe-bench: 72.0% (72-74% range, https://arxiv.org/html/2512.02556v1)
     *   - architecture: 671B total, 37B active (moe)
     */
    'chutes/deepseek/v3.2': {
      model: 'deepseek-ai/DeepSeek-V3.2-TEE',
      description: 'deepseek-v3.2 - newer v3 variant, code-strong (128K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 100, per: { seconds: 1 } },
            latency: { seconds: 1 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
            output: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 128_000 } }, // 128K context
          grades: { swe: 72.0 }, // 72.0% swe-bench verified (72-74% range)
          cutoff: '2025-12-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * deepseek-r1
     * .sources:
     *   - rates: https://github.com/rajashekar/llm-chutes ($0.27/1M input, $0.27/1M output)
     *   - context: 128K
     *   - architecture: 671B total, 37B active (moe), chain-of-thought
     */
    'chutes/deepseek/r1': {
      model: 'deepseek-ai/DeepSeek-R1-TEE',
      description: 'deepseek-r1 - chain-of-thought (128K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 60, per: { seconds: 1 } },
            latency: { seconds: 1.5 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
            output: dividePrice({ of: '$0.27', by: 1_000_000 }), // $0.27/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 128_000 } }, // 128K context
          grades: { swe: 49.2 }, // 49.2% swe-bench verified (original r1)
          cutoff: '2025-01-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * kimi-k2-think (chain-of-thought variant, tee-only on chutes)
     * .sources:
     *   - rates: https://openrouter.ai/provider/chutes ($0.20/1M input, $0.60/1M output)
     *   - context: 256K (huggingface model card)
     *   - swe-bench: 71.3% (huggingface kimi-k2 model card)
     *   - architecture: 1T total (moe), chain-of-thought
     *   - note: only the K2-Thinking-TEE variant is on chutes (not base K2-Instruct)
     */
    'chutes/kimi/k2-think': {
      model: 'moonshotai/Kimi-K2-Thinking-TEE',
      description:
        'kimi-k2-think - chain-of-thought, tee-only on chutes (256K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 80, per: { seconds: 1 } },
            latency: { seconds: 1 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.20', by: 1_000_000 }), // $0.20/1M tokens
            output: dividePrice({ of: '$0.60', by: 1_000_000 }), // $0.60/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 256_000 } }, // 256K context
          grades: { swe: 71.3 }, // 71.3% swe-bench verified
          cutoff: '2025-06-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * kimi-k2.5 (tee variant on chutes)
     * .sources:
     *   - rates: https://mastra.ai/providers ($0.60/1M input, $3.00/1M output)
     *   - context: 262K
     *   - swe-bench: 76.8% verified
     *   - note: tee-only variant on chutes (prompts encrypted via trusted execution environment)
     */
    'chutes/kimi/k2.5': {
      model: 'moonshotai/Kimi-K2.5-TEE',
      description: 'kimi-k2.5 - best swe-bench, tee-only on chutes (262K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 100, per: { seconds: 1 } },
            latency: { seconds: 0.8 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.60', by: 1_000_000 }), // $0.60/1M tokens
            output: dividePrice({ of: '$3.00', by: 1_000_000 }), // $3.00/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 262_000 } }, // 262K context
          grades: { swe: 76.8 }, // 76.8% swe-bench verified
          cutoff: '2025-07-01',
          domain: 'ALL',
          skills: { tooluse: true, vision: true }, // vision via MoonViT
        },
      }),
    },
    /**
     * glm-4.7 (fp8 variant on chutes)
     * .sources:
     *   - rates: https://openrouter.ai/provider/chutes ($0.30/1M input, $1.00/1M output)
     *   - context: 203K
     *   - swe-bench: 73.8% verified
     */
    'chutes/glm/4.7': {
      model: 'zai-org/GLM-4.7-FP8',
      description: 'glm-4.7 - strong code + general, fp8 variant (203K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 100, per: { seconds: 1 } },
            latency: { seconds: 0.8 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.30', by: 1_000_000 }), // $0.30/1M tokens
            output: dividePrice({ of: '$1.00', by: 1_000_000 }), // $1.00/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 203_000 } }, // 203K context
          grades: { swe: 73.8 }, // 73.8% swe-bench verified
          cutoff: '2025-06-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * glm-5 (tee variant on chutes)
     * .sources:
     *   - rates: estimated from glm-4.7 tier ($0.30/1M input, $1.00/1M output)
     *   - context: 203K
     *   - swe-bench: 77.8% (https://winbuzzer.com/2026/02/12/zhipu-ai-glm-5)
     *   - architecture: 744B total, ~40-44B active (moe)
     *   - note: newest glm model on chutes, tee-only, top open-source swe-bench
     */
    'chutes/glm/5': {
      model: 'zai-org/GLM-5-TEE',
      description:
        'glm-5 - top open-source swe-bench (77.8%), tee-only on chutes (203K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 100, per: { seconds: 1 } },
            latency: { seconds: 0.8 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.30', by: 1_000_000 }), // $0.30/1M tokens
            output: dividePrice({ of: '$1.00', by: 1_000_000 }), // $1.00/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 203_000 } }, // 203K context
          grades: { swe: 77.8 }, // 77.8% swe-bench verified (top open-source)
          cutoff: '2025-07-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
    /**
     * hermes-4-405b (chutes-exclusive)
     * .sources:
     *   - rates: estimated from similar tier ($0.30/1M input, $1.00/1M output)
     *   - context: 128K
     *   - architecture: 405B fp8, largest hermes model
     */
    'chutes/hermes/4-405b': {
      model: 'NousResearch/Hermes-4-405B-FP8-TEE',
      description: 'hermes-4-405b - largest hermes model (128K)',
      spec: new BrainSpec({
        cost: {
          time: {
            speed: { tokens: 60, per: { seconds: 1 } },
            latency: { seconds: 1.5 },
          },
          cash: {
            per: 'token',
            cache: {
              get: asIsoPrice('$0'),
              set: asIsoPrice('$0'),
            },
            input: dividePrice({ of: '$0.30', by: 1_000_000 }), // $0.30/1M tokens
            output: dividePrice({ of: '$1.00', by: 1_000_000 }), // $1.00/1M tokens
          },
        },
        gain: {
          size: { context: { tokens: 128_000 } }, // 128K context
          grades: {},
          cutoff: '2025-06-01',
          domain: 'ALL',
          skills: { tooluse: true },
        },
      }),
    },
  };
