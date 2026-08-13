---
name: angular-senior-dev
description: Use whenever writing, reviewing, or refactoring Angular code in this project (components, services, state, templates, routes). Enforces the official Angular style guide and modern Angular 20 best practices already established in this codebase — standalone components, signals, OnPush, the new control-flow syntax, and inject(). Trigger on ".ts"/".html" files under src/app, or requests to add/change a component, service, route, or template.
---

# Senior Angular developer

Write and review Angular code the way this codebase already does it, and the way the
[official Angular style guide](https://angular.dev/style-guide) recommends — not generic
tutorial-era Angular (NgModules, constructor DI, `*ngIf`, `BehaviorSubject`-as-state). Every
rule below is either lifted from the style guide or matched to a real pattern already in this
repo — check an existing file in the same folder before inventing a new convention.

## Components

- **Standalone only.** Every component/directive/pipe declares its own `imports: []`; no
  `NgModule` gets created for feature code. (Reference: any component under
  `src/app/application-project-editor/`.)
- **`ChangeDetectionStrategy.OnPush` on every component, no exceptions.** If a template isn't
  updating, the fix is a signal/input, not switching to Default.
- **`inject()` at the field initializer, not constructor injection.** `private api =
  inject(ProjectEditorApi);`, matching every service/component in this repo. Constructor bodies
  are for wiring subscriptions (`takeUntilDestroyed`), not for assigning injected deps.
- **One component per file, file name matches selector minus prefix**, kebab-case
  (`layer-property-builder.ts`, selector `de-layer-property-builder`).
- Prefer small, focused components over one large template with a dozen `@if` branches. If a
  template section has its own local state or is reused, extract it.
- Use `input()`/`output()` (signal-based) for new components rather than `@Input()`/`@Output()`
  decorators, unless the surrounding file already uses the decorator form — match the file.

## Templates

- **New control-flow syntax only**: `@if`/`@else`, `@for (x of xs; track x.id)`, `@switch`.
  Never `*ngIf`/`*ngFor`/`*ngSwitch` — this repo has fully moved off the structural-directive
  syntax.
- **`@for` always needs a real `track` expression** (an id, not `$index`, unless the list has
  no stable identity).
- Keep template logic to property/method reads that are cheap or memoized (signals,
  `computed()`). Don't call a function that does array filtering/mapping directly in a template
  binding if it'll re-run every change-detection pass — compute it as a `computed()` on the
  component/service instead.
- Bind classes/styles with `[class.x]`/`[style.x]` or the `NgClass`/`class` object form already
  used in this repo (see `application-project-editor.html`), not string concatenation in the
  component.

## Styling

- **Use Tailwind utility classes in the template as the default way to style anything.** This
  is a hard project rule, not just a preference — check `src/app/**/*.scss` before writing one:
  almost every component stylesheet in this repo is just `:host { display: block; }` because
  styling already happens in the template via Tailwind classes.
- Only reach for a component `.scss` file for what Tailwind genuinely can't express: consuming
  the theme's CSS custom properties (`--project-*` in `ThemeManager.applyThemeToDom` /
  `src/project-theme.scss`), deep Angular Material internals, or real animations/keyframes. Keep
  it as small as possible even then.
- **Tailwind v4, CSS-first config** — there is no `tailwind.config.js`; setup lives in
  `src/styles.scss` (`@use 'tailwindcss'`). If you build a Tailwind class dynamically at runtime
  from a variable (e.g. the widget system's `` `bg-${color.name}-${range}` `` pattern in
  `layerPropertyModel.background`/`color` handling), it won't be in any static template Tailwind
  can scan — **add it to the `@source inline(...)` safelist in `src/styles.scss`** or the class
  gets purged from the build and the style silently does nothing. Follow the existing
  `@source inline("bg-{color}-{100..900}")`-style entries there.
- Reuse the project's existing theme-driven utility classes (`font-heading`, `font-body`,
  `text-site-h2`, `text-site-body`, `rounded-theme`, `de-input`, etc.) instead of inventing a
  new ad hoc Tailwind combination for a concern the theme system already covers.
- Angular Material components (`mat-icon`, `matIconButton`, etc.) are fine to keep using where
  already used (toolbar, form fields) — don't rip them out — but for new UI, Tailwind-first is
  the default, not a new Material component.

## State & reactivity

- **Signals are the default state primitive** in this codebase (`signal()`, `computed()`,
  `effect()`) — see `ApplicationEditorState`, `WidgetsState`, `ThemeManager`. New state goes in
  a signal unless it's inherently a stream of async events (HTTP, router, websocket), which
  stays RxJS.
- Expose state as `readonly` (`.asReadonly()`) from services; only the owning service mutates
  its own signals. Don't reach into another service's private signal.
- **RxJS is for async/event sources**, not general state. `HttpClient` calls stay `Observable`;
  once a response lands and needs to live in component/service state, put it in a signal.
- Bridge the two with `toObservable()`/`toSignal()` (`@angular/core/rxjs-interop`) rather than
  manually subscribing and calling `.set()` in a way that leaks — see the autosave wiring in
  `application-project-editor.ts` (`toObservable(this.state.layers).pipe(debounceTime(...))`)
  for the pattern to copy.
- **Every manual `.subscribe()` in a component must be torn down** — `takeUntilDestroyed(this.destroyRef)`
  is the standard here, not `ngOnDestroy` + manual `Subscription` bags.
- Don't use `effect()` for state derivation that `computed()` can do. `effect()` is for actual
  side effects (DOM writes, logging) — see `ThemeManager`'s `applyThemeToDom` effect for a
  legitimate use.

## Dependency injection & services

- `@Injectable({ providedIn: 'root' })` for app-wide singletons (state, API clients) — this repo
  doesn't use feature-level providers for these. Only scope a provider narrower than root when
  there's a real reason (e.g. per-route instance state).
- Services should have one clear responsibility — this repo already splits editor concerns into
  `LayersEditor` (tree ops), `ThemeManager` (theme), `DataAccess` (API↔state glue),
  `ApplicationEditorState` (state + history). Follow that split rather than adding unrelated
  methods to whichever service is closest at hand.

## TypeScript

- `strict`, `strictTemplates`, `strictInjectionParameters`, and `strictInputAccessModifiers` are
  all on (`tsconfig.json`) — don't introduce `any` to work around a type error; fix the type.
  `as any` on a DTO boundary is the one place this repo tolerates it (see `ProjectResponseDto`
  handling) — don't spread the habit further.
- Prefer a real interface/type in `types/` over an inline object type repeated in more than one
  place.
- Use the `@app/*` path alias (`tsconfig.app.json`) for cross-feature imports; relative imports
  (`../..`) are fine within the same feature folder.

## Performance & correctness

- OnPush + signals should mean you rarely need `ChangeDetectorRef.markForCheck()` — if you find
  yourself reaching for it, check whether the underlying state should be a signal instead.
- Lazy-load feature routes (`loadChildren`/`loadComponent`) — see `app.routes.ts` — rather than
  adding new feature modules to the eager bundle.
- Don't mutate signal values in place (`arr.push(...)` then re-`.set()` the same reference) —
  always produce a new array/object so change detection and `computed()` deps see the change.

## Naming & structure

- Files: kebab-case. Classes: PascalCase. Signals/methods/properties: camelCase, no Hungarian
  prefixes (`_foo` only for a private backing signal paired with a public readonly, as in
  `_hasUnsavedChanges` / `hasUnsavedChanges`).
- Feature-first folders (`application-project-editor/{state,services,components,widgets-lib,types}`),
  not type-first (`components/`, `services/` at the app root) — put new editor code inside the
  feature folder it belongs to, not in `src/app/shared` unless it's genuinely reused across
  features.

## Before calling Angular work done

1. `npx tsc -p tsconfig.app.json --noEmit` — must be clean.
2. `npx ng build` — must succeed; this also runs Angular's template type-checking
   (`strictTemplates`), which plain `tsc` doesn't.
3. Skim the diff for: missing `OnPush`, a stray `*ngIf`/`*ngFor`, constructor-injected deps,
   an un-torn-down `.subscribe()`, or state that should've been a signal.
4. `ng test` in this repo currently fails broadly with `NG0908: Angular requires Zone.js` — a
   pre-existing test-harness gap (no `zone.js` dependency against zone-based `TestBed`), not a
   signal that your change broke something. Don't chase it unless the user asks you to fix the
   test setup itself.
