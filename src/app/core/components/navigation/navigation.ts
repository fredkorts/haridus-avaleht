import { Component, HostListener, Input, Output, EventEmitter, inject, effect, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';
import { HOME_NAVIGATION_ITEM, PRIMARY_NAVIGATION_ARIA_LABEL, TEST_NAVIGATION_ITEM } from '../../constants/navigation.constants';

type RouterLinkActiveOptions = {
  exact?: boolean;
};

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  @Input() isOpen = false;
  @Output() navigationClosed = new EventEmitter<void>();
  private readonly mobileBreakpoint = 1025;
  protected readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  // Signal that updates when translations or theme changes
  protected readonly themeLabel = signal('');
  protected readonly primaryNavLabel = PRIMARY_NAVIGATION_ARIA_LABEL;
  protected readonly homeNav = HOME_NAVIGATION_ITEM;
  protected readonly testNav = TEST_NAVIGATION_ITEM;
  protected readonly homeNavActiveOptions: RouterLinkActiveOptions | undefined =
    this.homeNav.exact ? { exact: this.homeNav.exact } : undefined;

  constructor() {
    // Update theme label when translations load or theme changes
    effect(() => {
      const isDark = this.themeService.theme() === 'dark';
      // Show what theme you'll switch TO, not current theme
      const key = isDark ? 'dark_mode.disable' : 'dark_mode.enable';
      this.themeLabel.set(this.translate.instant(key));
    });

    // Re-compute label when language changes
    this.translate.onLangChange.subscribe(() => {
      const isDark = this.themeService.theme() === 'dark';
      const key = isDark ? 'dark_mode.disable' : 'dark_mode.enable';
      this.themeLabel.set(this.translate.instant(key));
    });
  }

  toggleNav(): void {
    this.isOpen = !this.isOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  handleLinkSelection(): void {
    if (this.isMobileViewport()) {
      this.isOpen = false;
      this.navigationClosed.emit();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobileViewport() && this.isOpen) {
      this.isOpen = false;
    }
  }

  private isMobileViewport(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < this.mobileBreakpoint;
  }
}
