import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LANGUAGE_STORAGE_KEY } from './core/constants/storage.constants';
import { NavigationComponent } from './core/components/navigation/navigation';

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
  
  isNavOpen = false;
  
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
    this.navigation?.toggleNav();
  }
  constructor() {
    const fallback = 'et';
    const stored = this.readStoredLang();

    this.t.addLangs([fallback]);
    this.t.setDefaultLang(fallback);
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
