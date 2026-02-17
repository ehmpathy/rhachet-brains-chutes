# ref: chutes alternatives on bittensor

> what other subnets/providers exist on bittensor for inference?

---

## 1. bittensor subnet landscape

bittensor has 64+ subnets, each specialized for different ai tasks. chutes (subnet 64) is not the only inference option:

| subnet | name | focus | operator |
|--------|------|-------|----------|
| **SN64** | chutes | serverless inference (llm, image, audio) | rayon labs |
| **SN1** | apex | conversational ai inference | opentensor |
| **SN4** | targon | private compute (tvm) | manifold labs |
| **SN19** | nineteen | image generation + reason | rayon labs |
| **SN51** | lium | gpu marketplace | lium |
| **SN8** | taoshi | time series prediction | taoshi |
| **SN9** | pretrain | model train coordination | opentensor |

---

## 2. chutes vs lium (direct competitor)

lium (SN51) is the most direct alternative to chutes:

| dimension | chutes (SN64) | lium (SN51) |
|-----------|---------------|-------------|
| focus | serverless inference api | gpu marketplace rental |
| model access | pre-hosted models | pick your gpu, run your model |
| market cap | ~$100M | ~$51M |
| charge model | per-token / subscription | per-hour gpu rental |
| ease of use | api call (like openai) | more hands-on (rent + deploy) |

**lium is half the market value** but offers more flexibility if you want to run custom models or need specific gpu types.

---

## 3. chutes vs apex (SN1)

apex is another inference subnet, but more specialized:

| dimension | chutes | apex |
|-----------|--------|------|
| scope | general (llm, image, audio) | conversational agents |
| model variety | 48+ models via openrouter | focused on chat/dialogue |
| api style | openai-compatible | custom api |
| market position | largest by volume | specialized niche |

---

## 4. chutes vs targon (SN4)

targon offers private compute:

| dimension | chutes | targon |
|-----------|--------|--------|
| privacy | prompts visible to miners | private tvm (targon virtual machine) |
| use case | public inference | sensitive workloads |
| trade-off | cheaper, less private | more private, potentially more complex |

if prompt privacy matters (enterprise, healthcare, finance), targon may be preferable.

---

## 5. rayon labs ecosystem

chutes is part of a suite by rayon labs:

| subnet | purpose |
|--------|---------|
| **chutes (SN64)** | serverless inference |
| **nineteen (SN19)** | image generation + reason (dsis framework) |
| **gradients** | model fine-tune |

rayon labs operates multiple subnets, so chutes benefits from their broader ecosystem investment.

---

## 6. when to use which

| scenario | recommendation |
|----------|----------------|
| llm inference via api | chutes (easiest, most models) |
| custom model deployment | lium (gpu rental) |
| conversational agents | apex |
| private/sensitive workloads | targon |
| image generation | nineteen |
| price-sensitive experiments | lium (half the market cap) |

---

## 7. summary

chutes is the **dominant inference subnet** by volume and model variety, but alternatives exist:

- **lium** = cheaper, more manual (gpu rental vs api)
- **apex** = conversational specialization
- **targon** = privacy-focused compute
- **nineteen** = image/vision tasks

for a rhachet-brains adapter, chutes remains the best target due to openai-compatible api and model breadth.

---

## sources

1. [subnet alpha: chutes](https://subnetalpha.ai/subnet/chutes/)
2. [6 top subnets on bittensor](https://www.altcoinbuzz.io/reviews/6-top-subnets-on-bittensor/)
3. [bittensor subnet landscape eval](https://alphasigmacapitalresearch.substack.com/p/evaluating-the-bittensor-subnet-landscape)
4. [taostats subnets](https://taostats.io/subnets)
5. [taomarketcap](https://taomarketcap.com/)
