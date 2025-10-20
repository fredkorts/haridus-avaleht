# Haridus Avaleht - AI Agent Instructions

## Application Overview

An **Angular 20 standalone component application** (no NgModules) using the latest Angular CLI. Clean, minimal setup with SCSS styling.

## Project Structure

```
src/
├── app/
│   ├── features/          # Feature modules (e.g., frontpage/)
│   ├── app.ts            # Root component (standalone)
│   ├── app.routes.ts     # Routing configuration
│   └── app.config.ts     # Application providers
```

## Key Patterns

### Standalone Components
- **All components are standalone**: Import dependencies directly in `@Component.imports` array
- **No NgModules**: Application uses standalone APIs introduced in Angular 14+
- **Example pattern** (`app/features/frontpage/frontpage.ts`):
  ```typescript
  @Component({
    selector: 'app-frontpage',
    imports: [CommonModule, ReactiveFormsModule],  // Direct imports
    templateUrl: './frontpage.html',
    styleUrl: './frontpage.scss'
  })
  export class Frontpage { }
  ```

### Signal-Based State
- **Prefer signals** over traditional properties (see `app.ts` using `signal()`)
- Modern Angular encourages signals for reactive state management
- Use `computed()` for derived values, `effect()` for side effects

### File Naming Convention
- Components: `component-name.ts` (not `.component.ts`)
- Templates: `component-name.html`
- Styles: `component-name.scss`
- Tests: `component-name.spec.ts`
- **Lowercase with hyphens** for file names

### Angular CLI Code Generation
```bash
ng generate component component-name    # Creates standalone component
ng generate service service-name
ng generate directive directive-name
ng generate pipe pipe-name
ng generate --help                      # See all schematics
```

All generated code will follow standalone patterns by default.

## Development Commands

```bash
ng serve           # Dev server on :4200 (auto-reload)
ng build           # Production build to dist/
ng test            # Run Karma/Jasmine unit tests
ng generate --help # List available schematics
```

## Configuration Files

- **`angular.json`**: CLI configuration (build budgets: 500kB warning, 1MB error)
- **`tsconfig.app.json`**: App TypeScript config
- **`tsconfig.spec.json`**: Test TypeScript config
- **`package.json`**: Prettier configured for 100 char width, single quotes, Angular HTML parser

## Testing Approach

- **Framework**: Karma + Jasmine (Angular defaults)
- **Test files**: Co-located `*.spec.ts` files next to components
- **Run tests**: `ng test` (launches Chrome with watch mode)

## Styling

- **SCSS** is the default (configured in `angular.json` schematics)
- **Global styles**: `src/styles.scss`
- **Component styles**: Scoped via `styleUrl` property
- **Assets**: Place in `public/` folder (copied to build output)

## Critical Conventions

1. **Standalone-first**: Never use NgModules unless integrating legacy libraries
2. **Signals for state**: Use `signal()`, `computed()`, `effect()` for reactive state
3. **Routing**: Configure routes in `app.routes.ts` using `Routes` array
4. **Dependency injection**: Provide services in `app.config.ts` using `provideXxx()` functions
5. **Build budgets**: Keep bundle sizes under 500kB (warning threshold)

## Important Files

- `src/app/app.ts` - Root component with signal example
- `src/app/app.routes.ts` - Route definitions
- `src/app/app.config.ts` - Application providers
- `src/main.ts` - Bootstrap entry point
- `angular.json` - CLI configuration and build settings

## Tech Stack
- **Framework**: Angular 20.3
- **Language**: TypeScript 5.9
- **Styling**: SCSS
- **Testing**: Karma, Jasmine
- **Build**: Angular CLI with esbuild
