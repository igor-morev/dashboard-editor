# Project context: application-project-editor

This file covers stable architecture facts — what the app is, how it's organized, how to run
it. It does not track build status or phase progress; that's `.claude/roadmap.md`, updated
separately so this file doesn't need to change every time work lands. If you're tempted to add
"done"/"in progress"/"as of &lt;date&gt;" prose here, it belongs in roadmap.md instead.

dashboard-editor is an Angular 20 (standalone components, Material, Tailwind v4) app whose core
feature is a drag-and-drop website/page builder, referred to in-repo as an "application
project." Two top-level areas own this domain:

- `src/app/application-projects/` — project list/landing view.
- `src/app/application-project-editor/` — the actual editor: layers, widgets, theming, AI
  generation, state, export.

The original (Russian) MVP scope doc was `application-project-editor/readme.md`; it's been
removed and folded into `.claude/roadmap.md` (which also tracks current coverage of each item)
so there's one place to check, not two drifting ones.

## Data model

(`application-project-editor/types/project.type.ts`, `api/types/project.ts`)

- A project's content tree is a `Layer` (recursive: `parentId`, `sourceWidgetId`,
  `widgetReference`, `layerPropertyModel`, `children`, `isVisible`, `locked`). `AppViewSchema`
  holds `device` (`sm|md|lg|xl|2xl`) + flat `layers` + `layersMap`. `AppState` wraps `projectId`,
  `pages`, `selectedPage`, `selectedLayer`, `appViewSchema`.
- `DesignTokens` (theme) carries `primaryColor`, `surfaceColor`, `contrastColor`,
  `borderRadius`, `fontFamily` (heading/body pair), `typeScale`, `baseFontSize`.
- Widget library lives in `application-project-editor/widgets-lib/` (block, button, card,
  column, container, heading, icon, icon-button, image, link, link-button, list, list-item,
  row, section, text, plus composite `sections/` — header/hero/features/testimonials/faq/
  footer/contact).
- Persistence is lossy on one specific point by design: `LayersEditor.toLayer()` rebuilds a
  saved layer's `widgetReference` from a type registry (a representative widget of that
  `widgetType`), not the exact original widget instance, since only `widgetType` is persisted
  over the wire. Content/styling round-trip fine; anything depending on widget-specific
  metadata beyond `widgetType` would not. This is an architectural property of the DTO shape,
  not a bug to fix incidentally.

## AI generation

`application-project-editor/ai/ai.md` is the system prompt for an LLM that acts as a "UI
template architect," outputting only JSON (industry, theme, sections[] with type/layout/
content) using a fixed set of layout variants per section type. Wired through
`ProjectEditorApi.generatePageAI()` → `POST /ai/generate`.

## Backend

`ProjectEditorApi` (`api/services/project-editor-api.ts`) talks to a NestJS API at
`environment.apiUrl` (proxied via `proxy.conf.json` to `http://localhost:3000`, global prefix
`api`, plus a `/ws` websocket proxy). **The backend lives in a separate sibling repo**,
`/Users/igormorev/dev/nest-api` (NestJS + TypeORM + Postgres) — not a subfolder of this repo.
That repo has its own skill, `nest-api/.claude/skills/nestjs-senior-dev/SKILL.md`, documenting
its module/DTO/auth/migration/testing conventions — read that instead of re-deriving them here.

## Local dev setup

Two repos need to run together — this one doesn't work standalone:

1. **Backend** (`/Users/igormorev/dev/nest-api`): needs a `.env` with `DB_TYPE`, `DB_HOST`,
   `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`, `JWT_ACCESS_SECRET`,
   `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN`, `FRONTEND_URL`,
   `GEMINI_API_KEY` (used by the AI generation endpoint). Postgres must already have the schema
   migrated (check `.claude/roadmap.md` for whether the latest migration has actually been run).
   Run with `npm run start:dev`; listens on `PORT` (defaults to 3000) with global prefix `api`,
   so real routes are `http://localhost:3000/api/...`.
2. **Frontend** (this repo): `npm start` runs `ng serve --ssl --ssl-cert ./ssl/localhost.pem
   --ssl-key ./ssl/localhost-key.pem --proxy-config proxy.conf.json` on port 4200 — HTTPS is
   required (cert files already checked in under `ssl/`). `proxy.conf.json` forwards `/api` and
   `/ws` to `http://localhost:3000`, matching `environment.apiUrl: 'api'`. Start the backend
   first, or API calls will fail against nothing.

## Known gaps (structural, not phase-status)

- **`ng test` is broken repo-wide** (`NG0908: Angular requires Zone.js`) — no `zone.js`
  dependency against zone-based `TestBed`. Verify Angular changes with `tsc --noEmit` +
  `ng build` instead (see `.claude/skills/angular-senior-dev/SKILL.md`).

## Roadmap & current status

Tracked in `.claude/roadmap.md`, not here — that file has the phase checklist, what's shipped,
and what's next. Update it as work progresses instead of adding status notes to this file.
