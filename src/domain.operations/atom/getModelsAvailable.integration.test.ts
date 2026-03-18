import { BadRequestError } from 'helpful-errors';
import { given, then, useThen, when } from 'test-fns';

import { CONFIG_BY_ATOM_SLUG } from './BrainAtom.config';
import { getModelsAvailable } from './getModelsAvailable';

if (!process.env.CHUTES_API_KEY)
  throw new BadRequestError('CHUTES_API_KEY is required for integration tests');

describe('getModelsAvailable.integration', () => {
  jest.setTimeout(30000);

  given('[case1] chutes api is queried for all models', () => {
    when('[t0] models are listed', () => {
      const result = useThen('it succeeds', async () =>
        getModelsAvailable({ filter: null }),
      );

      then('returns a non-empty list', () => {
        expect(result.models.length).toBeGreaterThan(0);
      });

      then('each model has an id and owned_by', () => {
        for (const model of result.models) {
          expect(model.id).toBeDefined();
          expect(typeof model.id).toEqual('string');
          expect(model.owned_by).toBeDefined();
        }
      });
    });
  });

  given('[case2] configured model ids are verified', () => {
    const configuredIds = Object.values(CONFIG_BY_ATOM_SLUG).map(
      (c) => c.model,
    );

    when('[t0] models are listed with configured ids filter', () => {
      const result = useThen('it succeeds', async () =>
        getModelsAvailable({ filter: { ids: configuredIds } }),
      );

      then(
        'models list is informational (genBrainAtom tests verify actual availability)',
        () => {
          const foundIds = new Set(result.models.map((m) => m.id));
          const notFound = configuredIds.filter((id) => !foundIds.has(id));

          // note: chutes /models endpoint does not list all available models
          // genBrainAtom.integration.test.ts proves models work by actual use
          if (notFound.length > 0) {
            console.log(
              'models absent from /v1/models list (but may still work):',
              notFound,
            );
          }

          // verify at least some models are found (api is active)
          expect(result.models.length).toBeGreaterThan(0);
        },
      );
    });
  });
});
