# Specification: v1.5.0 Compatibility Release

**Task ID:** `v1-5-0-release`
**Status:** Completed and documented
**Completed:** 2026-03-16

## Outcome
- Completed a compatibility-focused `v1.5.0` release pass for `wp-block-to-html`.
- Updated the package, block coverage, and docs around WordPress `6.9` as the main compatibility baseline.
- Added selected WordPress `7.0 beta/RC` compatibility where new block or metadata shapes directly affect output.
- Replaced overstated public support claims with audited compatibility language and explicit deferred scope.

## Key Release Highlights
- Corrected release messaging in public docs from blanket "all core blocks supported" claims to tested compatibility statements.
- Hardened hot conversion paths by removing debug logging and slimming incremental rendering output.
- Consolidated SSR behavior into a single implementation shared by source imports and built package exports.
- Aligned the package surface with shipped entrypoints by exporting `hydration`, `angular`, `svelte`, and `blocks/theme`.
- Added or hardened support for `core/buttons`, `core/math`, `core/accordion`, `core/latest-comments`, `core/terms-query`, `core/comments-link`, `core/comments-count`, and `core/breadcrumbs`.
- Extended social/embed provider coverage for newer official services such as `x`, `bluesky`, `videopress`, `wordpress-tv`, and `wolfram`.

## Compatibility Matrix

| WordPress Version | Status | Notes |
|------------------|--------|-------|
| `6.8` | Supported | Stable baseline for existing installs |
| `6.9` | Supported | Primary compatibility target for this release |
| `7.0 beta/RC` | Partial | Includes `core/breadcrumbs` and `metadata.blockVisibility`; broader theme/query/navigation parity remains deferred |

## Implementation Discoveries

### 2026-03-16 - Discovery: Public support claims were overstated
**Context**: Existing top-level docs and historical release messaging implied broader core-block coverage than the active handler registry actually provided.
**Change**: Updated release-facing docs to use audited compatibility statements and an explicit compatibility matrix.
**Impact**: The project narrative is now aligned with implementation reality, reducing release risk and support ambiguity.
**Decision**: Keep older `v1.0.0` language as historical context only, while presenting `v1.5.0` as a compatibility release.

### 2026-03-16 - Discovery: Built entrypoints and package exports had drifted
**Context**: The build produced entrypoints such as `hydration`, while `package.json` exports did not expose the same surface.
**Change**: Synced exported subpaths with built outputs, including `hydration`, `angular`, `svelte`, and `blocks/theme`.
**Impact**: Consumers can now import the documented package surface consistently.
**Decision**: Treat package-surface alignment as release work, not a follow-up cleanup.

### 2026-03-16 - Addition: `blockVisibility` compatibility became part of release scope
**Context**: WordPress `7.0` introduces viewport-based `metadata.blockVisibility` shapes that affect block rendering and compatibility.
**Change**: Added metadata-aware compatibility handling for viewport visibility state.
**Impact**: Newer metadata-rich blocks degrade more safely instead of silently losing intended visibility semantics.
**Decision**: Support selected `7.0 beta/RC` metadata changes now, while keeping broader `7.0` editor/runtime work out of scope.

### 2026-03-16 - Refinement: Theme/query/navigation parity remains deferred
**Context**: The initial research surfaced broader theme-block, query-loop, comments-loop, and navigation gaps than could be responsibly closed in one compatibility release.
**Change**: Kept the release scoped to high-impact `6.9` and selected `7.0` items, while documenting the remaining gap explicitly.
**Impact**: The release improves correctness without reintroducing misleading coverage claims.
**Decision**: Defer full `core/navigation`, `core/query*`, site blocks, template parts, and related theme-family work to future specs.

## Verification Summary
- Package builds completed successfully.
- Test suites passed after the compatibility and performance changes landed.
- Benchmarks were rerun and release docs were updated with repository-backed measurements.

## Source History
- `../v1-0-0-release/spec.md` preserves the original stable-release launch record.
- `../legacy-memory-bank/activeContext.md` preserves earlier release and roadmap context.
- `../legacy-memory-bank/progress.md` preserves pre-SDD milestone tracking and historical notes.
