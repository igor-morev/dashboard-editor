# Roadmap & status

**Last updated: 2026-08-13.** This file is the *only* place phase/progress status lives for
this project — `.claude/context.md` intentionally has none, to keep that file stable. Update
this file's status markers directly when a phase's state changes; don't let it silently rot,
and don't re-add status prose to `context.md` instead of here. For exact "what changed and
when," `git log` is always more authoritative than this file's prose — this file is for
*current state and what's next*, not a changelog.

Plan file (phase definitions/rationale): `/Users/igormorev/.claude/plans/atomic-stargazing-frog.md`
UX walkthrough of all five planned screens: https://claude.ai/code/artifact/b9d0d731-73e5-4e1c-8f7e-ee57b92ef63f

## Phases

- [x] **Phase 0** — AI generation renders on the canvas immediately after a successful
  `generatePageAI` call, instead of only landing in the template list.
- [x] **Phase 1** — Full persistence loop, both repos: backend `project`/`page` module + JWT-scoped
  ownership + migration written (see below); frontend real API contract, autosave + Save
  button, real project list/create, layer-tree serialize/hydrate, hardcoded nav ids replaced
  with real ones. Verified via `tsc --noEmit` + `ng build` + `nest build` (`ng test` doesn't
  count — see Known Gaps in `context.md`).
  - ⚠️ **The Phase 1 migration has not been run against the real database.** Written and
    verified to compile (`nest-api/src/migrations/1786656980000-CreateProjectAndPage.ts`), but
    deliberately not executed — confirm with the user before running `npm run migration:run`.
  - Refactor pass (2026-08-13, after the skills were written): added `takeUntilDestroyed` to
    every one-shot `.subscribe()` this phase introduced (prevents stale-response races on fast
    navigation), converted `savedAtLabel` to a `computed()` signal, and added real
    `project.service.spec.ts`/`project.controller.spec.ts` (mocked repositories, 21 passing
    tests) — the first real (non-stub) backend spec files in this repo. That also surfaced and
    fixed a repo-wide Jest config bug (missing `modulePaths`, meant every existing spec touching
    a related entity failed at module-load time) — see the Testing section of
    `nest-api/.claude/skills/nestjs-senior-dev/SKILL.md` for the remaining, separate, pre-existing
    gap (11 other spec suites still fail on unmocked DI, not something this pass fixed).
- [ ] **Phase 2** — Auth/project-scoping sanity check. Should already hold (new backend routes
  read `req.user.sub` for ownership) but not explicitly re-verified end-to-end with a real login.
- [ ] **Phase 3** — Wire the existing-but-orphaned `src/app/version-comparison/`/
  `object-comparison/` components into the editor as a real diff view for AI regenerations /
  history snapshots.
- [ ] **Phase 4** — Turn the existing `DesignTokens`/`ThemeManager` plumbing into a visible
  one-click restyle panel.

## Original MVP scope — current coverage

Mapping of the team's original (Russian) MVP checklist from `application-project-editor/readme.md`
(removed — this supersedes it) to current status:

- **Widgets** — atoms ✅, molecules ✅.
- **Container widget templates** — in progress: header, hero, section (product/service),
  banner, section (contact), footer exist; not all have the ideal 5 layout variants yet (see
  `ai/ai.md` for the current variant lists per section type).
- **Industry template sets** — only Healthcare has a full section breakdown drafted. Most
  "industry" content today is mock data seeding the AI-generated tab for demos
  (`application-project-editor/mock/`: construction, fintech, gaming, clinic), not curated
  templates. Construction, Fintech, Dogs Grooming, Food Service, Gaming, AI, Telecom remain
  unbuilt as real templates.
- **Multi-page scaling** (optional) — ✅ data model + API support it (Phase 1).
- **Multi-project scaling** (optional) — ✅ (Phase 1: real project list, create, per-user scoping).
- **Storage** — auth ✅, autosave ✅ (to the API, not localStorage), full save ✅, partial save
  n/a (full-page save model), export to html ✅, picture/pdf ❌.
- **AI-generated templates** — prompt form ✅, AI service/model ✅ (`POST /ai/generate`), JSON
  template output ✅.

## Next up

Decide whether/when to run the pending Phase 1 migration, then Phase 2, then Phase 3 or 4
depending on priority.
