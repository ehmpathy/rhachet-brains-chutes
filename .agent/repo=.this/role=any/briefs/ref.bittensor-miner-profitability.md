# ref: bittensor miner profitability

> how much do miners actually profit? why do people do it?

---

## 1. the harsh reality

**most miners do not profit.** the distribution is extremely skewed:

| percentile | monthly tao earnings | monthly usd (at $180/tao) |
|------------|---------------------|---------------------------|
| top 1% | 150+ tao | $27,000+ |
| top 5% | 30-150 tao | $5,400-27,000 |
| top 25% | 5-30 tao | $900-5,400 |
| median | 3-6 tao | $540-1,080 |
| bottom 50% | 0-3 tao | $0-540 |

**critical insight**: median income of $540-1,080/mo does not cover:
- electricity (~$100-300/mo for a single gpu rig)
- colocation (~$100-500/mo for chutes bare metal requirement)
- hardware depreciation (~$100-200/mo amortized)

---

## 2. who actually profits

### 2.1 datacenters with spare capacity

| profile | why they profit |
|---------|-----------------|
| cloud providers | gpus sit idle between customer jobs |
| render farms | film/vfx work is seasonal |
| ai labs | train clusters idle between runs |

**marginal cost is near zero** — they already paid for hardware, power, and network. tao emissions are pure gravy.

### 2.2 cheap-power operators

| region | electricity cost | advantage |
|--------|-----------------|-----------|
| iceland | $0.05/kwh | geothermal, cold climate |
| texas | $0.06/kwh | grid surplus, no cooling |
| kazakhstan | $0.04/kwh | coal, minimal regulation |
| norway | $0.05/kwh | hydro, cold climate |

vs average us: $0.15/kwh — a 3x cost disadvantage.

### 2.3 early movers on new subnets

new subnets have:
- fewer miners → higher emission share per miner
- less optimization → easier to rank well
- lower registration fees (before congestion)

early entry on a subnet that grows → disproportionate tao accumulation.

---

## 3. why people still mine (despite low margins)

### 3.1 idle gpu value capture

| scenario | economics |
|----------|-----------|
| gamer with 3090 | gpu sits idle 20 hrs/day; any tao > $0 is profit |
| ai researcher | personal rig unused on weekends |
| small business | workstations idle overnight |

**mental model**: "i already own the gpu. electricity is my only cost. even 0.5 tao/month is found money."

### 3.2 tao speculation

| bet | logic |
|-----|-------|
| "tao will 10x" | if i earn 5 tao/mo at $180, that's $900/mo. if tao hits $1,800, those 5 tao become $9,000. |
| "accumulate now, sell later" | halve reduced emissions → scarcity → price pressure |
| "ai narrative is early" | bittensor is undervalued relative to ai market potential |

**critical**: many miners are net negative on usd basis but net positive on tao accumulation as an investment thesis.

### 3.3 low marginal cost for datacenters

| cost type | datacenter | hobbyist |
|-----------|------------|----------|
| hardware | already owned | $2,000-4,500 upfront |
| power | bulk rate ($0.05/kwh) | retail rate ($0.15/kwh) |
| colocation | they ARE the colocation | $100-500/mo |
| staff | shared across operations | personal time |

**datacenters can profit at 10 tao/mo. hobbyists need 30+ tao/mo to break even.**

### 3.4 hobbyist / "i like to tinker" motivation

| motivation | profile |
|------------|---------|
| learn ai/ml infra | students, career changers |
| participate in decentralized ai | ideological alignment |
| build portfolio | "i run bittensor miners" on resume |
| experiment with new tech | enjoy the optimization game |

**not about profit** — about skill, community, and belief in the mission.

---

## 4. realistic profitability math

### 4.1 chutes miner (bare metal, a10 gpu)

| line item | monthly cost |
|-----------|--------------|
| hardware amortization | $50-100 (assuming 3-year life) |
| colocation | $150-300 |
| power | $50-100 |
| **total monthly cost** | **$250-500** |

| tao earnings | usd value | profit/loss |
|--------------|-----------|-------------|
| 2 tao | $360 | -$140 to +$110 |
| 5 tao | $900 | +$400 to +$650 |
| 10 tao | $1,800 | +$1,300 to +$1,550 |

**breakeven: ~3-4 tao/month** — achievable only for top 25% miners.

### 4.2 hobbyist miner (home rig, rtx 3090)

| line item | monthly cost |
|-----------|--------------|
| hardware amortization | $30-50 |
| electricity | $50-100 |
| internet (already paid) | $0 |
| **total monthly cost** | **$80-150** |

| tao earnings | usd value | profit/loss |
|--------------|-----------|-------------|
| 0.5 tao | $90 | -$60 to +$10 |
| 1 tao | $180 | +$30 to +$100 |
| 2 tao | $360 | +$210 to +$280 |

**breakeven: ~0.5-1 tao/month** — achievable for most active miners.

---

## 5. the speculation overlay

### 5.1 tao as an investment

| scenario | tao price | 5 tao/mo value |
|----------|-----------|----------------|
| current | $180 | $900/mo |
| 2x (bullish) | $360 | $1,800/mo |
| 5x (very bullish) | $900 | $4,500/mo |
| 0.5x (bear market) | $90 | $450/mo |

**many miners are underwrite profit via tao price appreciation** — they accept negative cash flow in exchange for tao accumulation.

### 5.2 emission halve impact

| event | daily emission | miner share (41%) |
|-------|----------------|-------------------|
| pre-dec 2025 | 7,200 tao | 2,952 tao/day |
| post-dec 2025 | 3,600 tao | 1,476 tao/day |
| next halve | 1,800 tao | 738 tao/day |

**halve = same competition, half the rewards** — marginal miners leave, concentrated gains for survivors.

---

## 6. summary

| question | answer |
|----------|--------|
| do most miners profit? | **no** — bottom 50% break even or lose |
| who profits? | datacenters (low marginal cost), cheap-power operators, early movers |
| why mine if not profitable? | idle gpu value capture, tao speculation, hobby/ideological motivation |
| typical hobbyist outcome | breakeven or slight profit (~$0-100/mo) |
| typical pro outcome | moderate profit ($500-5,000/mo) if optimized |
| is hardware purchase worth it? | **rarely** — unless you have cheap power and believe in tao |

**the honest take**: bittensor is not "free money." it rewards those with prior capital advantages (datacenters, cheap power) and punishes late entrants who buy hardware at retail prices with retail electricity.

---

## sources

1. [taostats miner leaderboards](https://taostats.io/miners)
2. [bittensor emissions calculator](https://docs.learnbittensor.org/learn/emissions)
3. [chutes miner docs](https://chutes.ai/docs/miner-resources/overview)
4. [subnet alpha: chutes economics](https://subnetalpha.ai/subnet/chutes/)
5. [bittensor miner infrastructure guide](https://ionstream.ai/running-a-high-performance-bittensor-validator-or-miner-heres-the-infrastructure-checklist/)
6. [electricity prices by country (2026)](https://www.globalpetrolprices.com/electricity_prices/)
