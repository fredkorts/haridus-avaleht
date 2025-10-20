# Haridusportaal Avaleht

A modern Angular 20 standalone application that renders the Haridusportaal front page ("Avaleht") by consuming live JSON APIs for both content and UI translations. This demo showcases clean separation of concerns, type-safe data flows, and resilient UX patterns using Angular's latest features.

## Project Overview

This application demonstrates a production-ready approach to building data-driven Angular apps:

- **Dynamic content loading**: Front page content fetched from a remote API
- **API-driven translations**: UI strings loaded from backend endpoints (currently Estonian only)
- **Type-safe architecture**: Service → Mapper → ViewModel → Template flow with full TypeScript coverage
- **Modern Angular**: Standalone components, built-in control flow (`@if`, `@for`, `@switch`), signal-based reactivity
- **Resilient UX**: View-state management (loading/error/empty/ready) with retry capabilities

## Tech Stack

- **Framework**: Angular 20.3 (standalone components, no NgModules)
- **Language**: TypeScript 5.9
- **Styling**: SCSS with responsive Grid layouts
- **HTTP**: Angular HttpClient with `provideHttpClient()`
- **i18n**: `@ngx-translate/core` v17 + custom API-backed loader
- **Testing**: Karma + Jasmine
- **Build**: Angular CLI with esbuild

## Project Structure

```
src/app/
├── core/
│   ├── models/
│   │   └── frontpage.types.ts      # API types + ViewModel definitions
│   └── services/
│       └── frontpage.service.ts    # HttpClient service for /api/frontpage
├── features/
│   └── frontpage/
│       ├── frontpage.ts            # Standalone component with view-state logic
│       ├── frontpage.html          # Template using @if/@for/@switch
│       ├── frontpage.scss          # Responsive, accessible styles
│       └── frontpage.mapper.ts     # API → ViewModel normalization
├── app.routes.ts                   # Route config: { path: '', component: Frontpage }
├── app.config.ts                   # Providers: router, HttpClient, TranslateModule
└── app.ts                          # Root component; initializes i18n with 'et'
```

## Architecture & Data Flow

### Content Loading Strategy

1. **Service Layer** (`FrontpageService`):

   - Calls `GET https://api.haridusportaal.twn.zone/api/frontpage?_format=json&content_type=`
   - Returns typed `Observable<FrontpageApi>` with full Drupal-style response structure

2. **Mapper Layer** (`mapFrontpage()`):

   - Transforms nested API structures into a flat, UI-friendly `FrontpageVM`
   - Handles optional fields defensively (extracts first items from map-like objects)
   - Enforces business rules (e.g., only show news if `fieldFrontpageNewsAllowed === '1'`)
   - Outputs normalized data: title, contact, news, descriptionHtml, services, topics, links

3. **Component Layer** (`FrontpageComponent`):

   - Composes reactive stream: `vm$ = service.getFrontpage().pipe(map(mapFrontpage))`
   - Advanced version exposes `state$` with discriminated union types: `{ kind: 'loading' | 'error' | 'empty' | 'ready', vm?, error? }`
   - Provides `retry()` method for user-initiated error recovery

4. **Template Layer** (`frontpage.html`):
   - Uses `@switch (state$ | async)` to handle all view states declaratively
   - Renders loading spinners, error alerts (with retry buttons), empty states, and ready content
   - Employs `@if`/`@for` control flow with scoped variables (`@let vm = s.vm`)
   - Uses `routerLink` for internal navigation, `href` with `rel="noopener"` for external links

### Translation Management

**Custom API-Backed i18n Loader**:

```typescript
class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return this.http.get(
      `https://api.haridusportaal.twn.zone/api/translations?_format=json&lang=${lang}`
    );
  }
}
```

**Configuration** (`app.config.ts`):

- Integrated via `TranslateModule.forRoot()` with `importProvidersFrom()` for standalone setup
- Default language: `'et'` (Estonian)
- Custom `MissingTranslationHandler` logs missing keys to console and returns empty strings
- Graceful degradation: if backend fails, UI renders without translated strings

**Usage Patterns**:

- **UI chrome** (headings, buttons): `{{ 'frontpage.news' | translate }}`
- **API content** (titles, HTML descriptions): Rendered as-is (no translation needed)
- Currently read-only; only Estonian translations available from backend

## Modern Angular Features

### Standalone Components

All components use `standalone: true` with direct imports:

```typescript
@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './frontpage.html'
})
```

### Built-in Control Flow

Replaced legacy `*ngIf/*ngFor` with new syntax:

```html
@if (vm.contact; as c) {
<address>@if (c.email) { <a [href]="'mailto:'+c.email">{{ c.email }}</a> }</address>
} @for (service of vm.services; track service.title) {
<article>{{ service.title }}</article>
} @switch (state$ | async; as s) { @case ('loading') {
<p aria-live="polite">Loading...</p>
} @case ('error') {
<div role="alert">{{ s.error }}</div>
} @case ('ready') {
<!-- render vm -->
} }
```

### Type Safety

Full end-to-end typing:

- `FrontpageApi` - Exact API response structure (Drupal fields)
- `FrontpageVM` - Normalized ViewModel for UI consumption
- `ViewState<T>` - Discriminated union for loading states

## Accessibility & Best Practices

✅ **Semantic HTML**: `<header>`, `<section>`, `<article>`, `<nav>`, `<address>`, logical heading hierarchy (h1–h3)  
✅ **Keyboard navigation**: Visible `:focus-visible` outlines, semantic link/button usage  
✅ **Screen reader support**: `aria-live="polite"` for loading states, `role="alert"` for errors  
✅ **Safe HTML rendering**: Only trusted API descriptions use `[innerHTML]`, all else uses text binding  
✅ **Responsive design**: CSS Grid with `repeat(auto-fit, minmax(240px, 1fr))` for card layouts

## Known Limitations

⚠️ **Translations**: Backend currently provides Estonian only; no local fallback strategy for missing keys (production would use Transloco with typed, lazy-loaded scopes)  
⚠️ **HTML Sanitization**: API-provided HTML treated as trusted for demo purposes; production needs stricter DomSanitizer policies  
⚠️ **Design**: No Figma spec provided—focused on clarity, responsiveness, and accessibility over pixel-perfect visuals

## Why This Architecture?

**Separation of Concerns**: HTTP logic in services, data normalization in mappers, rendering in templates → easier testing, code review, and maintenance

**Type Safety**: Explicit API/ViewModel types catch inconsistencies at compile-time, reducing runtime errors

**Declarative UI**: RxJS streams + `async` pipe eliminate manual subscription management and memory leaks

**Modern Angular**: Standalone APIs reduce boilerplate; new control flow improves readability and bundle size

**Resilience**: View-state patterns and defensive mapping ensure users always see helpful feedback (loading/error/retry)

## Development Commands

### Start Dev Server

```bash
ng serve
```

Runs on `http://localhost:4200/` with live reload.

### Build for Production

```bash
ng build
```

Outputs optimized artifacts to `dist/`. Bundle budgets: 500kB warning, 1MB error.

### Run Tests

```bash
ng test
```

Launches Karma test runner with Jasmine in Chrome.

### Code Generation

```bash
ng generate component component-name    # Creates standalone component
ng generate service service-name
ng generate --help                      # See all schematics
```

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Standalone Components Guide](https://angular.dev/guide/components/importing)
- [Built-in Control Flow](https://angular.dev/guide/templates/control-flow)
- [@ngx-translate Documentation](https://github.com/ngx-translate/core)
