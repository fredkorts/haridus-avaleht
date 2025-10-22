# Haridusportaal Avaleht

A modern Angular 20 standalone application that renders the Haridusportaal front page ("Avaleht") by consuming live JSON APIs for both content and UI translations.

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

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Angular CLI** (latest version)

## Installation & Setup

### 1. Install Angular CLI globally

```bash
npm install -g @angular/cli
```

### 2. Clone and setup the project

```bash
# Clone the repository
git clone <repository-url>
cd haridus-avaleht

# Install all dependencies
npm install
```

### 3. Start the development server

```bash
ng serve
```

The application will be available at `http://localhost:4200/` with live reload enabled.

## Project Structure

```
src/app/
├── core/
│   ├── components/
│   │   └── navigation/             # Navigation component
│   ├── config/
│   │   └── api-tokens.ts           # API configuration tokens
│   ├── constants/
│   │   ├── app-shell.constants.ts  # App shell constants
│   │   ├── i18n.constants.ts       # Internationalization constants
│   │   ├── navigation.constants.ts # Navigation configuration
│   │   └── storage.constants.ts    # Storage keys and constants
│   ├── models/
│   │   └── frontpage.types.ts      # API types + ViewModel definitions
│   └── services/
│       ├── frontpage.service.ts    # HttpClient service for /api/frontpage
│       └── theme.service.ts        # Theme management service
├── features/
│   ├── frontpage/
│   │   ├── frontpage.ts            # Standalone component with view-state logic
│   │   ├── frontpage.html          # Template using @if/@for/@switch
│   │   ├── frontpage.scss          # Responsive, accessible styles
│   │   ├── frontpage.mapper.ts     # API → ViewModel normalization
│   │   ├── frontpage.constants.ts  # Frontpage-specific constants
│   │   └── styles/                 # Component-specific styles
│   └── test-page/                  # Test page feature
├── app.ts                          # Root component; initializes i18n with 'et'
├── app.html                        # Root template
├── app.scss                        # Global styles
├── app.routes.ts                   # Route config: { path: '', component: Frontpage }
└── app.config.ts                   # Providers: router, HttpClient, TranslateModule
```

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

## Accessibility & Best Practices

✅ **Semantic HTML**: `<header>`, `<section>`, `<article>`, `<nav>`, `<address>`, logical heading hierarchy (h1–h3)  
✅ **Keyboard navigation**: Visible `:focus-visible` outlines, semantic link/button usage  
✅ **Screen reader support**: `aria-live="polite"` for loading states, `role="alert"` for errors  
✅ **Safe HTML rendering**: Only trusted API descriptions use `[innerHTML]`, all else uses text binding  
✅ **Responsive design**: CSS Grid with `repeat(auto-fit, minmax(240px, 1fr))` for card layouts

## Known Limitations

⚠️ **Translations**: Backend currently provides Estonian only; no local fallback strategy for missing keys  
⚠️ **HTML Sanitization**: API-provided HTML treated as trusted for demo purposes; production needs stricter DomSanitizer policies  
⚠️ **Design**: No Figma spec provided—focused on clarity, responsiveness, and accessibility over pixel-perfect visuals

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Standalone Components Guide](https://angular.dev/guide/components/importing)
- [Built-in Control Flow](https://angular.dev/guide/templates/control-flow)
- [@ngx-translate Documentation](https://github.com/ngx-translate/core)
