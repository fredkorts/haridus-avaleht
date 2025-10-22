import { Component, HostListener, Input, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  @Input() isOpen = false;
  private readonly mobileBreakpoint = 1025;
  private readonly themeService = inject(ThemeService);
  private readonly translate = inject(TranslateService);

  protected readonly themeLabel = computed(() =>
    this.themeService.theme() === 'dark' 
      ? this.translate.instant('dark_mode.enable')
      : this.translate.instant('dark_mode.disable')
  );

  toggleNav(): void {
    this.isOpen = !this.isOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  handleLinkSelection(): void {
    if (this.isMobileViewport()) {
      this.isOpen = false;
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
