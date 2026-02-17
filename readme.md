# rhachet-brains-chutes

rhachet brain.atom adapter for chutes open-source models

## install

```sh
npm install rhachet-brains-chutes
```

## usage

```ts
import { genBrainAtom } from 'rhachet-brains-chutes';
import { z } from 'zod';

// create a brain atom for direct model inference
const brainAtom = genBrainAtom({ slug: 'chutes/qwen3/coder-next' });

// simple string output
const { output: explanation } = await brainAtom.ask({
  role: { briefs: [] },
  prompt: 'explain this code',
  schema: { output: z.string() },
});

// structured object output
const { output: { summary, issues } } = await brainAtom.ask({
  role: { briefs: [] },
  prompt: 'analyze this code',
  schema: { output: z.object({ summary: z.string(), issues: z.array(z.string()) }) },
});
```

## available brains

### atoms (via genBrainAtom)

stateless inference without tool use.

| slug | model | context | swe-bench | input | output |
| --- | --- | --- | --- | --- | --- |
| `chutes/qwen3/coder-next` | Qwen/Qwen3-Coder-Next | 262K | 70.6% | $0.07/1M | $0.30/1M |
| `chutes/qwen3/coder-480b` | Qwen/Qwen3-Coder-480B-A35B-Instruct-FP8-TEE | 262K | 69.6% | $0.22/1M | $0.95/1M |
| `chutes/qwen3/235b` | Qwen/Qwen3-235B-A22B-Instruct-2507-TEE | 262K | 61.7% | $0.08/1M | $0.55/1M |
| `chutes/deepseek/v3.1` | deepseek-ai/DeepSeek-V3.1-TEE | 128K | 66.0% | $0.27/1M | $0.27/1M |
| `chutes/deepseek/v3.2` | deepseek-ai/DeepSeek-V3.2-TEE | 128K | 72.0% | $0.27/1M | $0.27/1M |
| `chutes/deepseek/r1` | deepseek-ai/DeepSeek-R1-TEE | 128K | 49.2% | $0.27/1M | $0.27/1M |
| `chutes/kimi/k2-think` | moonshotai/Kimi-K2-Thinking-TEE | 256K | 71.3% | $0.20/1M | $0.60/1M |
| `chutes/kimi/k2.5` | moonshotai/Kimi-K2.5-TEE | 262K | 76.8% | $0.60/1M | $3.00/1M |
| `chutes/glm/4.7` | zai-org/GLM-4.7-FP8 | 203K | 73.8% | $0.30/1M | $1.00/1M |
| `chutes/glm/5` | zai-org/GLM-5-TEE | 203K | 77.8% | $0.30/1M | $1.00/1M |
| `chutes/hermes/4-405b` | NousResearch/Hermes-4-405B-FP8-TEE | 128K | — | $0.30/1M | $1.00/1M |

## why chutes

chutes runs on bittensor subnet 64 — a decentralized compute network where gpu miners earn tao tokens for open-source model inference. this crypto-subsidized model enables rates 5-7x cheaper than centralized providers for the same models.

### cost comparison vs together ai

| model | chutes (in/out) | together ai (in/out) | delta |
| --- | --- | --- | --- |
| qwen3 coder-next | **$0.07/$0.30** | $0.50/$1.20 | 7x/4x cheaper |
| qwen3 235b | **$0.08/$0.55** | $0.20/$0.60 | 2.5x/1.1x cheaper |
| deepseek v3.1 | **$0.27/$0.27** | $1.25/$1.25 | 4.6x cheaper |
| deepseek r1 | **$0.27/$0.27** | $3.00/$7.00 | 11x/26x cheaper |
| kimi k2-think | **$0.20/$0.60** | $1.00/$3.00 | 5x cheaper |

### trade-offs

- **no enterprise sla** — miner-dependent availability; occasional 503 "no instances available" errors when capacity is low
- **prompt visibility** — prompts are visible to anonymous miners in cleartext (unless tee-enabled chutes are used)
- **rate stability** — rates are subsidized by tao token emissions; if tao value drops, rates may change
- **best fit** — cost-sensitive workloads, batch tasks, development, and cases that tolerate retries

## environment

requires `CHUTES_API_KEY` environment variable.

get your api key at https://chutes.ai — key prefix is `cpk_`

## sources

- [chutes api docs](https://chutes.ai/docs)
- [chutes models](https://chutes.ai/models)
- [chutes rates](https://chutes.ai/rates)
- [bittensor subnet 64](https://www.bittensor.ai/subnets/64)
