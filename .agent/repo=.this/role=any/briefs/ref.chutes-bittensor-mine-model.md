# ref: chutes bittensor mine model

> do miners already mine tao and just swap to inference? how does it actually work?

---

## 1. bittensor is NOT like bitcoin

**critical distinction**: bittensor "mine" is fundamentally different from bitcoin mine.

| aspect | bitcoin | bittensor |
|--------|---------|-----------|
| **what miners do** | compute useless hashes (proof of work) | perform useful ai tasks (proof of intelligence) |
| **how miners earn** | solve cryptographic puzzles | provide quality inference/train compute |
| **compute purpose** | pure waste (intentional) | productive work (inference) |
| **hardware** | asics (hash-optimized) | gpus (ai-optimized) |

**bittensor miners don't "already mine tao" and then switch to inference.** the inference IS how they mine. there's no separate "mine" activity — you earn tao BY inference work.

---

## 2. how chutes miners earn tao

### 2.1 the flow

```
gpu miner joins subnet 64 (chutes)
       ↓
miner hosts a model (e.g., qwen3-coder-next)
       ↓
user sends inference request via chutes api
       ↓
chutes routes request to miner
       ↓
miner processes inference, returns response
       ↓
validators score miner's response quality
       ↓
yuma consensus allocates tao based on scores
       ↓
miner receives tao emissions proportional to performance
```

### 2.2 what determines miner income

| factor | impact |
|--------|--------|
| **response quality** | better outputs = higher validator scores = more tao |
| **latency** | faster responses = better scores |
| **availability** | more uptime = more requests = more chances to earn |
| **stake weight** | validators with more staked tao have more influence on score allocation |

---

## 3. the "proof of intelligence" model

bittensor calls this **"proof of useful work"** or **"proof of intelligence"**:

- you don't prove you wasted compute (bitcoin)
- you prove you provided useful ai compute (bittensor)
- the "work" is the actual inference request
- the "proof" is the validator consensus on quality

### 3.1 validator role

validators don't just rubber-stamp responses. they:
1. send test prompts to miners
2. evaluate response quality
3. score miners relative to each other
4. report scores to the network
5. yuma consensus aggregates scores into emission weights

miners who produce bad outputs get low scores → less tao.

---

## 4. why this enables cheap inference

the economic insight:

| traditional provider | chutes/bittensor |
|---------------------|------------------|
| user pays → provider pays gpu costs | user pays → miner already earns tao for the work |
| provider needs profit margin on compute | miner's primary income is tao emission, not api fee |
| rate = gpu cost + overhead + margin | rate = whatever covers coordination costs |

**miners are incentivized to serve inference regardless of api fees** because tao emissions are the main reward. the api fee is gravy.

this is why chutes can charge $0.07/1M tokens while together ai charges $0.50/1M — together ai has to cover gpu costs from api fees alone. chutes miners are already "paid" via tao.

---

## 5. what happens if tao crashes

if tao price drops significantly:
- miner income (in usd terms) drops
- unprofitable miners shut down gpus
- capacity on subnet 64 contracts
- fewer miners = "503 no instances available" errors
- chutes may need to raise api rates to attract miners with direct payments

**the subsidy depends on tao value.** if tao → $0, the economic model breaks.

---

## 6. summary

| question | answer |
|----------|--------|
| do miners mine tao separately? | **no** — inference IS how they mine |
| what is "proof of intelligence"? | earn tao via quality ai compute provision |
| why so cheap? | miners earn tao emissions regardless of api fees |
| sustainability? | depends on tao price; if tao crashes, model breaks |

---

## sources

1. [tao token economy explained](https://blog.bittensor.com/tao-token-economy-explained-17a3a90cd44e)
2. [bittensor emissions](https://docs.learnbittensor.org/learn/emissions)
3. [chutes: a decentralized ai platform](https://chutes.ai/news/chutes-a-decentralized-ai-platform)
4. [subnet alpha: chutes analysis](https://subnetalpha.ai/subnet/chutes/)
5. [bittensor tao beginner's guide](https://medium.com/@taofinney/bittensor-tao-a-beginners-guide-eb9ee8e0d1a4)
