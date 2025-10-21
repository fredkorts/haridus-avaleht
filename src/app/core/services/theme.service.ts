import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

type ThemePreference = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'preferred-theme';
  private readonly document = inject(DOCUMENT);

  readonly theme = signal<ThemePreference>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const activeTheme = this.theme();
      this.applyTheme(activeTheme);
    });
  }

  toggleTheme(): void {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): ThemePreference {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem(this.storageKey) as ThemePreference | null;
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: ThemePreference): void {
    this.document.body.classList.toggle('dark-theme', theme === 'dark');

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, theme);
    }
  }
}
