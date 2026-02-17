# brain config pattern

## .what

standardized pattern for brain atom configuration:

| file | export | purpose |
|------|--------|---------|
| `BrainAtom.config.ts` | `CONFIG_BY_ATOM_SLUG` | maps atom slugs to model configs |

## .why

- **single source of truth** — specs declared once in atom config
- **type safety** — slug types enforce valid mappings at compile time
- **future ready** — when a repl sdk is available, specs can be reused

## .structure

### atom config (`BrainAtom.config.ts`)

```ts
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

export type BrainAtomConfig = {
  model: string;
  description: string;
  spec: BrainSpec;
};

export const CONFIG_BY_ATOM_SLUG: Record<ChutesBrainAtomSlug, BrainAtomConfig> = {
  'chutes/qwen3/coder-next': {
    model: 'Qwen/Qwen3-Coder-Next',
    description: 'qwen3-coder-next - best cost/performance for code (262K)',
    spec: { ... },
  },
  // ...
};
```

### future repl config (`BrainRepl.config.ts`)

when a repl sdk is available, this package will add:

```ts
import {
  type BrainAtomConfig,
  CONFIG_BY_ATOM_SLUG,
} from './BrainAtom.config';

export type ChutesBrainReplSlug =
  | 'chutes/qwen3-code'
  | 'chutes/qwen3-code/fast';

/**
 * .what = repl config by slug
 * .why = maps repl slugs to atom configs (reuses specs from CONFIG_BY_ATOM_SLUG)
 */
export const CONFIG_BY_REPL_SLUG: Record<ChutesBrainReplSlug, BrainAtomConfig> = {
  'chutes/qwen3-code': CONFIG_BY_ATOM_SLUG['chutes/qwen3/coder-next'],
  'chutes/qwen3-code/fast': CONFIG_BY_ATOM_SLUG['chutes/qwen3/coder-next'],
};
```

## .slug conventions

### atom slugs (explicit)

format: `{provider}/{family}/{model}/{version?}`

examples:
- `chutes/qwen3/coder-next`
- `chutes/qwen3/coder-480b`
- `chutes/qwen3/235b`
- `chutes/deepseek/v3.1`
- `chutes/deepseek/v3.2`
- `chutes/deepseek/r1`
- `chutes/kimi/k2-think`
- `chutes/kimi/k2.5`
- `chutes/glm/4.7`
- `chutes/glm/5`
- `chutes/hermes/4-405b`

### repl slugs (aliases) — future

format: `{provider}/{capability}/{variant?}`

examples:
- `chutes/qwen3-code` → default qwen3 code model
- `chutes/qwen3-code/fast` → fast variant

## .key insight

repl slugs are **aliases** that map to **explicit atom slugs**:

```ts
// repl slug → atom slug → config
'chutes/qwen3-code' → 'chutes/qwen3/coder-next' → { model, description, spec }
```

this enables:
- simpler repl slugs for common use cases
- explicit atom slugs for precise model selection
- shared specs between atoms and repls (no duplication)

## .name conventions

| constant | scope | content |
|----------|-------|---------|
| `CONFIG_BY_ATOM_SLUG` | atom file | atom slug → config |
| `CONFIG_BY_REPL_SLUG` | repl file (future) | repl slug → atom config |
| `ChutesBrainAtomSlug` | type | union of valid atom slugs |
| `ChutesBrainReplSlug` | type (future) | union of valid repl slugs |
| `BrainAtomConfig` | type | shape of config object |
