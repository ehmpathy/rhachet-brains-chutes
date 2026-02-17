# ref: bittensor miner investment

> how much does it cost to set up a miner cluster? low end?

---

## 1. low-end entry point

### 1.1 cheapest hardware path

| component | spec | cost (used) |
|-----------|------|-------------|
| **gpu** | nvidia rtx 3090 (24gb vram) | $700-1,100 |
| **ram** | 24-32gb (match vram) | ~$80-150 |
| **cpu** | 8+ cores | ~$200-400 |
| **storage** | 1tb nvme | ~$80-100 |
| **total hardware** | | **~$1,100-1,800** |

the rtx 3090 is the sweet spot for budget miners — 24gb vram, widely available used, proven on many subnets.

### 1.2 registration cost (tao)

| item | cost |
|------|------|
| subnet slot registration | variable (dynamic, based on demand) |
| typical range | 0.1-10+ TAO (varies by subnet congestion) |
| at $180/tao | ~$18-1,800 for registration |

registration tao is **sunk cost** — you don't get it back.

---

## 2. chutes-specific requirements (SN64)

chutes has **stricter requirements** than generic subnets:

| requirement | detail |
|-------------|--------|
| **bare metal only** | no runpod, vast.ai, shared host |
| **static ip** | unique, static, 1:1 port map |
| **ram rule** | ram >= vram per gpu |
| **cpu node** | 8 cores, 64gb ram (for postgres, redis, api) |
| **storage** | 850gb+ for huggingface model cache |

### 2.1 chutes low-end estimate

| component | spec | cost |
|-----------|------|------|
| **gpu server** | 1x a10 or t4 (budget gpu) | ~$1,500-3,000 |
| **cpu server** | 8 core, 64gb ram | ~$500-1,000 |
| **network** | static ip, bare metal colocation | ~$100-300/mo |
| **total hardware** | | **~$2,000-4,000** |
| **monthly colocation** | | **~$100-500/mo** |

chutes supports cheap gpus (a10, a5000, t4) — you don't need h100s to start.

---

## 3. cloud rental alternative

if you don't want to buy hardware:

| provider | gpu | cost |
|----------|-----|------|
| vast.ai | rtx 3090 | ~$0.20-0.40/hr |
| runpod | rtx 3090 | ~$0.25-0.50/hr |
| lambda labs | a10 | ~$0.60/hr |

**but**: chutes requires bare metal — most cloud rentals won't work for SN64 specifically.

for other subnets (not chutes), cloud rental can work:
- ~$150-300/mo for 24/7 rtx 3090 rental
- lower upfront, higher long-term cost

---

## 4. realistic low-end totals

### 4.1 generic bittensor subnet (not chutes)

| item | low estimate | high estimate |
|------|--------------|---------------|
| used rtx 3090 | $700 | $1,100 |
| support hardware | $400 | $700 |
| tao registration | $50 | $500 |
| **total to start** | **$1,150** | **$2,300** |

### 4.2 chutes specifically (SN64)

| item | low estimate | high estimate |
|------|--------------|---------------|
| gpu server (bare metal) | $1,500 | $3,000 |
| cpu server | $500 | $1,000 |
| tao registration | $50 | $500 |
| monthly colocation | $100/mo | $300/mo |
| **total to start** | **$2,150** | **$4,500** |
| **monthly recurring** | **$100-300** | |

---

## 5. profitability reality check

| factor | detail |
|--------|--------|
| **competition** | high-emission subnets are crowded |
| **tao price risk** | income in tao; usd value fluctuates |
| **emission share** | miners get 41% of subnet emissions |
| **skill required** | not plug-and-play; requires optimization |

**no guaranteed roi** — many miners lose money, especially on competitive subnets. the low-end setup gets you in the door but doesn't guarantee profit.

---

## 6. summary

| question | answer |
|----------|--------|
| absolute minimum (generic subnet) | **~$1,200-2,000** (used 3090 + registration) |
| chutes minimum (SN64) | **~$2,000-4,500** (bare metal requirement) |
| monthly recurring (chutes) | **~$100-300** colocation |
| can you use cloud rentals? | some subnets yes, chutes no (bare metal only) |
| guaranteed profit? | **no** — competitive, tao-price dependent |

the barrier to entry is **not trivial** but also not massive — a few thousand dollars can get you started on budget subnets with used hardware.

---

## sources

1. [bittensor miner setup guide](https://blog.blockmagnates.com/how-to-set-up-your-first-bittensor-miner-a-complete-beginner-guide-dae7c5690cc4)
2. [chutes miner docs](https://chutes.ai/docs/miner-resources/overview)
3. [bittensor miner infrastructure checklist](https://ionstream.ai/running-a-high-performance-bittensor-validator-or-miner-heres-the-infrastructure-checklist/)
4. [taostats for miners](https://docs.taostats.io/docs/taostats-for-miners)
5. [vast.ai bittensor guide](https://docs.vast.ai/mining-on-bittensor)
6. [chutes miner github](https://github.com/chutesai/chutes-miner)
