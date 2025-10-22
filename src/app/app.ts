import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LANGUAGE_STORAGE_KEY } from './core/constants/storage.constants';
import { NavigationComponent } from './core/components/navigation/navigation';
import { ThemeService } from './core/services/theme.service';
import { APP_SHELL_COPY } from './core/constants/app-shell.constants';
import { DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from './core/constants/i18n.constants';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  @ViewChild(NavigationComponent) navigation?: NavigationComponent;
  private t = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  protected themeService = inject(ThemeService);
  protected readonly appShellCopy = APP_SHELL_COPY;

  isNavOpen = false;
  
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
    this.navigation?.toggleNav();
  }

  onNavigationClosed(): void {
    this.isNavOpen = false;
  }
  constructor() {
    const fallback = FALLBACK_LANGUAGE;
    const stored = this.readStoredLang();

    const supportedLanguages = Array.from(new Set([DEFAULT_LANGUAGE, FALLBACK_LANGUAGE]));
    this.t.addLangs(supportedLanguages);
    this.t.setDefaultLang(DEFAULT_LANGUAGE);
    this.t.use(stored || fallback);

    this.t.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: LangChangeEvent) => {
        try {
          localStorage.setItem(LANGUAGE_STORAGE_KEY, event.lang);
        } catch {
          // ignore storage failures (Safari private mode etc.)
        }
      });
  }

  private readStoredLang(): string | null {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
