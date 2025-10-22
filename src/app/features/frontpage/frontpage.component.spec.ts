import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TranslateLoader, TranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { FrontpageComponent } from './frontpage';
import { FrontpageService } from '../../core/services/frontpage.service';
import { FrontpageApi } from '../../core/models/frontpage.types';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

const TRANSLATIONS = {
  'common.loading': 'Loading…',
  'news.label': 'News',
  'home.services_title': 'Services',
  'button.read_more': 'Read more',
  'frontpage.errors.loadFailed': 'Failed to load frontpage'
};

describe('FrontpageComponent', () => {
  async function setup(response$: ReturnType<FrontpageService['getFrontpage']>) {
    await TestBed.configureTestingModule({
      imports: [FrontpageComponent],
      providers: [
        provideRouter([]),
        { provide: FrontpageService, useValue: { getFrontpage: () => response$ } },
        { provide: TranslateLoader, useClass: StaticTranslateLoader }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(FrontpageComponent);
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', TRANSLATIONS, true);
    translate.setDefaultLang('en');
    translate.use('en');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return { fixture };
  }

  it('renders the front page title once data is loaded', async () => {
    const api = {
      content: {
        title: 'Frontpage Title',
        fieldFrontpageNewsAllowed: '1',
        fieldFrontpageNews: [
          { title: 'News headline', entityUrl: { path: '/news/headline', routed: true } }
        ],
        fieldFrontpageNewsDescription: '<h1>Frontpage Title</h1>'
      }
    } as FrontpageApi;

    const { fixture } = await setup(of(api));
    const heading = fixture.nativeElement.querySelector('h1');

    expect(heading?.textContent?.trim()).toBe('Frontpage Title');
  });

  it('shows the error state when loading fails', async () => {
    const { fixture } = await setup(throwError(() => new Error('network error')));

    const errorSection: HTMLElement | null = fixture.nativeElement.querySelector('.state-error');
    expect(errorSection).not.toBeNull();
    expect(errorSection?.textContent).toContain('Failed to load frontpage');
  });
});
