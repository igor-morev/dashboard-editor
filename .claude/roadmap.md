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
  - ✅ **Migration run 2026-08-15** against local Postgres (Docker, `pgdb` container) —
    `project`/`page` tables confirmed created and match the design (verified directly via
    `psql`, not just CLI output, since TypeORM's CLI logging around this was misleading — see
    below). Running it surfaced a real, pre-existing, repo-wide bug it's worth knowing about:
    the TypeORM CLI (`typeorm-ts-node-commonjs`) couldn't resolve this codebase's `src/foo/bar`
    absolute-import convention at all (same root cause as the Jest `modulePaths` issue fixed
    earlier), *and* `src/room/room.enitity.ts` had a long-standing typo in its filename that
    silently excluded `Room` from `data-source.ts`'s `**/*.entity{.ts,.js}` glob — invisible
    until something actually drove the entity loader outside Nest's own bootstrap, which nothing
    had until now. Fixed both: added `"paths": {"src/*": ["src/*"]}` to `tsconfig.json` +
    `NODE_OPTIONS="-r tsconfig-paths/register"` in the `typeorm` npm script, and renamed
    `room.enitity.ts` → `room.entity.ts` (5 import sites updated). `npm run migration:run` now
    works cleanly for future migrations too.
  - Refactor pass (2026-08-13, after the skills were written): added `takeUntilDestroyed` to
    every one-shot `.subscribe()` this phase introduced (prevents stale-response races on fast
    navigation), converted `savedAtLabel` to a `computed()` signal, and added real
    `project.service.spec.ts`/`project.controller.spec.ts` (mocked repositories, 21 passing
    tests) — the first real (non-stub) backend spec files in this repo. That also surfaced and
    fixed a repo-wide Jest config bug (missing `modulePaths`, meant every existing spec touching
    a related entity failed at module-load time) — see the Testing section of
    `nest-api/.claude/skills/nestjs-senior-dev/SKILL.md` for the remaining, separate, pre-existing
    gap (11 other spec suites still fail on unmocked DI, not something this pass fixed).
  - Real-usage bug-fix pass (2026-08-14/15), found by actually using the editor after Phase 1
    landed: `image`/`icon` widget classes weren't rendering at all (`layer.html` bound `[class]`
    to the static widget-definition default instead of the live `layerPropertyModel`, for those
    two cases only); save→load was double-wrapping the tree in an extra scaffold layer
    (`DataAccess.save()`/`exportProject()` now serialize the unwrapped content, not the scaffold
    root); the wire-format `WidgetReference` was `{ widgetType }`-only, which can't disambiguate
    widgets that share a type (`hero-widget` vs `features-widget` vs bare `section-widget`, all
    `widgetType: 'section'`) — now `{ id, widgetType }`, with `id` as the primary lookup key in
    `LayersEditor.toLayer()`/`getWidgetById()`; and `layerPropertyModel.layout` (the selected
    layout variant) wasn't in the DTO at all, so a saved section's layout choice reverted on
    reload. All fixed and verified (`tsc`/`ng build`/`nest build`/tests clean on both repos).
- [x] **Phase 2** — Auth/project-scoping smoke-tested 2026-08-15 against the real running
  backend (a pre-existing long-lived `dist/main` process, port 3000) and real Postgres, with two
  freshly registered users and real JWTs (not mocks): user A creates a project, appears in A's
  `/project/list`, `GET`s at 200; user B gets 403 on both `GET /project/:id` and
  `GET/PUT /project/:projectId/page/:pageId` for A's project/page, and A's project doesn't
  appear in B's `/project/list`; an unauthenticated request gets 401. Also exercised a full
  save→reload round trip through the real API (`PUT` a layer, `GET` it back unchanged) —
  confirms the Phase 1 persistence chain works end-to-end, not just against mocks. Smoke-test
  users/project (`smoketest-a-*`/`smoketest-b-*`, "Smoke Test Project") are still in the local
  DB — harmless, but ask before assuming they should stay if this DB ever stops being
  throwaway-local.
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

Migration and Phase 2 smoke test are both done. Next is Phase 3 or 4, depending on priority —
nothing blocking either.
