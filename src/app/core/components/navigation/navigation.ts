import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  protected isOpen = false;
  private readonly mobileBreakpoint = 1025;

  toggleNav(): void {
    this.isOpen = !this.isOpen;
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
