import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/config/api-tokens';

// Custom loader since TranslateHttpLoader v17 constructor signature changed
class CustomTranslateLoader implements TranslateLoader {
  private cache = new Map<string, Observable<unknown>>();

  constructor(private http: HttpClient, private apiBaseUrl: string) {}

  getTranslation(lang: string): Observable<any> {
    if (!this.cache.has(lang)) {
      const request$ = this.http
        .get(`${this.apiBaseUrl}/translations`, { params: { _format: 'json', lang } })
        .pipe(
          catchError(err => {
            console.error('[i18n] failed to load translations', lang, err);
            return of({});
          }),
          shareReplay({ bufferSize: 1, refCount: false })
        );
      this.cache.set(lang, request$);
    }

    return this.cache.get(lang)! as Observable<any>;
  }
}

function httpLoaderFactory(http: HttpClient, apiBaseUrl: string) {
  return new CustomTranslateLoader(http, apiBaseUrl);
}

class LogMissing implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) { console.warn('[i18n missing]', params.key); return ''; }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'et',
        loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient, API_BASE_URL] },
        missingTranslationHandler: { provide: MissingTranslationHandler, useClass: LogMissing }
      })
    ),
  ]
};
