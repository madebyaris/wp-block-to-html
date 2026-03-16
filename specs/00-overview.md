# Project Overview: wp-block-to-html

## Product Summary

`wp-block-to-html` is a modular package that converts WordPress Gutenberg blocks into HTML and framework-specific output. The project reached a stable `v1.0.0` release with progressive hydration, strong performance, and broad framework support.

## Current Product Status

- Package: `wp-block-to-html`
- Release status: `v1.0.0` stable and published
- Core strengths: full core block support, framework adapters, CSS framework mappings, SSR optimizations, and hydration support
- Performance headline: up to 947 blocks per millisecond with highly modular bundles

## Architecture Highlights

- Strategy pattern for output formats, CSS frameworks, and content handling modes
- Factory pattern for handler and adapter creation
- Registry pattern for extensible block and framework registration
- Observer and streaming patterns for large-content processing and incremental work

## Historical Milestones

| Milestone | Date | Notes |
|-----------|------|-------|
| `hydration-phase1` | 2024-12-31 | Core hydration infrastructure completed and archived |
| `v1-0-0-release` | 2025-01-01 | Stable npm release and documentation launch completed |
| `v0.5.1` SSR optimization | 2025-03-24 | Core Web Vitals and SSR improvements |
| `v0.4.0` performance milestone | 2025-03-20 | 947 blocks/ms benchmark leadership |
| `v0.3.0` modular architecture | 2025-03-18 | Major bundle size reduction and subpath exports |

## Current Opportunities

- Framework-specific SSR optimizations
- Advanced performance and caching systems
- Accessibility improvements
- Real-time features and broader ecosystem tooling

## Historical Records In Specs

- Completed feature history: `specs/completed/hydration-phase1/`
- Release history: `specs/completed/v1-0-0-release/`
- Full migrated Memory Bank snapshot: `specs/completed/legacy-memory-bank/`

---
**Version:** SDD 5.0 for `wp-block-to-html`
