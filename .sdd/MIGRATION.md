# Spec-Kit Migration Notes

The migration from the custom Memory Bank plus VAN/PLAN/CREATIVE workflow to the lighter spec-kit SDD workflow is complete.

## Current Default
- New planning work lives in `specs/active/[task-id]/`
- Shared templates and guidance live in `.sdd/`
- Slash commands in `.cursor/commands/` are the default entrypoints

## Historical Records
| Legacy area | Migrated location |
|---|---|
| `memory-bank/` core files | `specs/completed/legacy-memory-bank/` |
| `docs/archive/feature-hydration-phase1_20241231.md` | `specs/completed/hydration-phase1/archive.md` |
| `memory-bank/reflection-hydration-phase1.md` | `specs/completed/hydration-phase1/retrospective.md` |
| release and publication history | `specs/completed/v1-0-0-release/` |

## Removed Legacy Workflow
- `.cursor/rules/isolation_rules/`
- `custom_modes/`
- `memory-bank/`
- `docs/archive/feature-hydration-phase1_20241231.md`

Use the migrated history in `specs/` whenever older project context is needed.
