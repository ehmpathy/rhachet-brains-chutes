import { BadRequestError } from 'helpful-errors';
import { BrainAtom } from 'rhachet';
import { given, then, useThen, when } from 'test-fns';
import { z } from 'zod';

import { genBrainAtom, getBrainAtomsByChutes } from './index';

if (!process.env.CHUTES_API_KEY)
  throw new BadRequestError('CHUTES_API_KEY is required for acceptance tests');

describe('rhachet-brains-chutes.acceptance', () => {
  jest.setTimeout(30000);

  given('[case1] the sdk is imported', () => {
    when('[t0] exports are checked', () => {
      then('getBrainAtomsByChutes is exported', () => {
        expect(getBrainAtomsByChutes).toBeDefined();
        expect(typeof getBrainAtomsByChutes).toEqual('function');
      });

      then('genBrainAtom is exported', () => {
        expect(genBrainAtom).toBeDefined();
        expect(typeof genBrainAtom).toEqual('function');
      });
    });
  });

  given('[case2] getBrainAtomsByChutes is called', () => {
    when('[t0] atoms are retrieved', () => {
      then('returns 11 BrainAtom instances', () => {
        const atoms = getBrainAtomsByChutes();
        expect(atoms).toHaveLength(11);
        for (const atom of atoms) {
          expect(atom).toBeInstanceOf(BrainAtom);
        }
      });

      then('each atom has a valid BrainSpec', () => {
        const atoms = getBrainAtomsByChutes();
        for (const atom of atoms) {
          expect(atom.spec).toBeDefined();
          expect(atom.spec.cost).toBeDefined();
          expect(atom.spec.cost.cash).toBeDefined();
          expect(atom.spec.gain).toBeDefined();
        }
      });
    });
  });

  given('[case3] a brain atom is asked a question', () => {
    const atom = genBrainAtom({ slug: 'chutes/qwen3/coder-next' });

    when('[t0] ask is called with prompt and schema', () => {
      const result = useThen('it succeeds', async () =>
        atom.ask({
          role: {},
          prompt: 'respond with exactly: acceptance test passed',
          schema: { output: z.object({ content: z.string() }) },
        }),
      );

      then('returns typed output', () => {
        expect(result.output).toBeDefined();
        expect(typeof result.output.content).toEqual('string');
        expect(result.output.content.length).toBeGreaterThan(0);
      });

      then('returns cost metrics', () => {
        expect(result.metrics).toBeDefined();
        expect(result.metrics.cost.cash.total).toBeDefined();
        expect(result.metrics.cost.time).toBeDefined();
      });
    });
  });
});
