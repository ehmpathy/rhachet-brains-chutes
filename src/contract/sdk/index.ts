import type { BrainAtom } from 'rhachet';

import { genBrainAtom } from '../../domain.operations/atom/genBrainAtom';

/**
 * .what = returns all brain atoms provided by chutes
 * .why = enables consumers to register chutes atoms with genContextBrain
 */
export const getBrainAtomsByChutes = (): BrainAtom[] => {
  return [
    genBrainAtom({ slug: 'chutes/qwen3/coder-next' }),
    genBrainAtom({ slug: 'chutes/qwen3/coder-480b' }),
    genBrainAtom({ slug: 'chutes/qwen3/235b' }),
    genBrainAtom({ slug: 'chutes/deepseek/v3.1' }),
    genBrainAtom({ slug: 'chutes/deepseek/v3.2' }),
    genBrainAtom({ slug: 'chutes/deepseek/r1' }),
    genBrainAtom({ slug: 'chutes/kimi/k2-think' }),
    genBrainAtom({ slug: 'chutes/kimi/k2.5' }),
    genBrainAtom({ slug: 'chutes/glm/4.7' }),
    genBrainAtom({ slug: 'chutes/glm/5' }),
    genBrainAtom({ slug: 'chutes/hermes/4-405b' }),
  ];
};

// re-export factory for direct access
export { genBrainAtom } from '../../domain.operations/atom/genBrainAtom';
