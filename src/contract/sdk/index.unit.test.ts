import { BrainAtom } from 'rhachet';
import { given, then, when } from 'test-fns';

import { genBrainAtom } from '../../domain.operations/atom/genBrainAtom';
import { getBrainAtomsByChutes } from './index';

describe('rhachet-brains-chutes.unit', () => {
  given('[case1] getBrainAtomsByChutes', () => {
    when('[t0] called', () => {
      then('returns array with 11 atoms', () => {
        const atoms = getBrainAtomsByChutes();
        expect(atoms).toHaveLength(11);
      });

      then('returns BrainAtom instances', () => {
        const atoms = getBrainAtomsByChutes();
        for (const atom of atoms) {
          expect(atom).toBeInstanceOf(BrainAtom);
        }
      });

      then('includes chutes/qwen3/coder-next', () => {
        const atoms = getBrainAtomsByChutes();
        const slugs = atoms.map((a: BrainAtom) => a.slug);
        expect(slugs).toContain('chutes/qwen3/coder-next');
      });
    });
  });

  given('[case2] genBrainAtom factory', () => {
    when('[t0] called with chutes/qwen3/coder-next slug', () => {
      const atom = genBrainAtom({ slug: 'chutes/qwen3/coder-next' });

      then('returns BrainAtom instance', () => {
        expect(atom).toBeInstanceOf(BrainAtom);
      });

      then('has correct slug', () => {
        expect(atom.slug).toEqual('chutes/qwen3/coder-next');
      });

      then('has correct repo', () => {
        expect(atom.repo).toEqual('chutes');
      });
    });
  });
});
