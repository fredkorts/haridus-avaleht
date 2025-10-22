import { Component, SecurityContext, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, Observable, of, shareReplay, startWith, tap } from 'rxjs';
import { FrontpageService } from '../../core/services/frontpage.service';
import { FrontpageVM } from '../../core/models/frontpage.types';
import { mapFrontpage } from './frontpage.mapper';
import { LANGUAGE_STORAGE_KEY } from '../../core/constants/storage.constants';
import {
  FRONTPAGE_ERROR_FALLBACK_MESSAGE,
  FRONTPAGE_LOAD_ERROR_KEY,
  FRONTPAGE_LOADING_FALLBACK_MESSAGE,
  FRONTPAGE_LOG_NAMESPACE,
  FRONTPAGE_PLACEHOLDER_IMAGE_ALT,
  IMAGE_PLACEHOLDER_DATA_URL,
} from './frontpage.constants';

type FrontpageState =
  | { status: 'loading' }
  | { status: 'loaded'; data: FrontpageVM }
  | { status: 'error'; error: string };

@Component({
  standalone: true,
  selector: 'app-frontpage',
  templateUrl: './frontpage.html',
  styleUrls: ['./frontpage.scss'],
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class FrontpageComponent {
  private svc = inject(FrontpageService);
  protected translate = inject(TranslateService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('servicesScroller') servicesScroller?: ElementRef<HTMLElement>;

  protected readonly loadErrorKey = FRONTPAGE_LOAD_ERROR_KEY;
  protected readonly loadErrorFallbackMessage = FRONTPAGE_ERROR_FALLBACK_MESSAGE;
  protected readonly loadingFallbackMessage = FRONTPAGE_LOADING_FALLBACK_MESSAGE;
  protected readonly placeholderImage = IMAGE_PLACEHOLDER_DATA_URL;
  protected readonly placeholderImageAlt = FRONTPAGE_PLACEHOLDER_IMAGE_ALT;

  readonly vmState$: Observable<FrontpageState> = this.svc.getFrontpage().pipe(
    map(mapFrontpage),
    map(vm => ({
      ...vm,
      descriptionHtml: vm.descriptionHtml
        ? this.sanitizer.sanitize(SecurityContext.HTML, vm.descriptionHtml) || undefined
        : undefined
    })),
    tap(vm => this.syncLanguages(vm.languages)),
    map<FrontpageVM, FrontpageState>(vm => ({ status: 'loaded', data: vm })),
    catchError(err => {
      console.error(`${FRONTPAGE_LOG_NAMESPACE} failed to load content`, err);
      return of<FrontpageState>({ status: 'error', error: FRONTPAGE_LOAD_ERROR_KEY });
    }),
    startWith<FrontpageState>({ status: 'loading' }),
    shareReplay({ bufferSize: 1, refCount: false })
  );

  onLanguageSelect(code: string) {
    if (!code) return;
    this.translate.use(code);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }

  private syncLanguages(languages: FrontpageVM['languages']) {
    if (!languages?.length) {
      return;
    }

    const desiredCodes = languages.map(l => l.code).filter(Boolean);
    if (desiredCodes.length) {
      const existing = this.translate.getLangs();
      const merged = Array.from(new Set([...existing, ...desiredCodes]));
      this.translate.addLangs(merged);
    }

    const stored = (() => {
      try {
        return localStorage.getItem(LANGUAGE_STORAGE_KEY);
      } catch {
        return null;
      }
    })();

    const available = new Set(desiredCodes);
    const fallback = languages.find(l => l.active)?.code || this.translate.getDefaultLang();
    const target = stored && available.has(stored) ? stored : fallback;

    if (target && this.translate.currentLang !== target) {
      this.translate.use(target);
    }
  }

  scrollServices(direction: 'left' | 'right') {
    const scroller = this.servicesScroller?.nativeElement;
    if (!scroller) return;

    const scrollAmount = scroller.offsetWidth * 0.8; // Scroll 80% of container width
    const currentScroll = scroller.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;

    scroller.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }
}
