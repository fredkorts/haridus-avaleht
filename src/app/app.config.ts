import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/config/api-tokens';
import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  I18N_LOG_NAMESPACE,
  I18N_MISSING_NAMESPACE,
  TRANSLATIONS_ENDPOINT,
} from './core/constants/i18n.constants';

// Custom loader since TranslateHttpLoader v17 constructor signature changed
class CustomTranslateLoader implements TranslateLoader {
  private cache = new Map<string, Observable<unknown>>();

  constructor(private http: HttpClient, private apiBaseUrl: string) {}

  getTranslation(lang: string): Observable<any> {
    // Check if we've already cached this language
    if (!this.cache.has(lang)) {
      const baseUrl = this.apiBaseUrl.replace(/\/api$/, ''); // Remove /api suffix
      
      // Try language-specific endpoint first, fall back to general endpoint
      const request$ = this.http
        .get(`${baseUrl}/${TRANSLATIONS_ENDPOINT}`, { params: { _format: 'json', lang } })
        .pipe(
          catchError(err => {
            // If language-specific request fails, try without lang parameter
            console.warn(`${I18N_LOG_NAMESPACE} failed to load translations for ${lang}, trying without lang parameter`, err);
            return this.http
              .get(`${baseUrl}/${TRANSLATIONS_ENDPOINT}`, { params: { _format: 'json' } })
              .pipe(
                catchError(fallbackErr => {
                  console.error(`${I18N_LOG_NAMESPACE} failed to load translations`, fallbackErr);
                  return of({});
                })
              );
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
  handle(params: MissingTranslationHandlerParams) {
    console.warn(I18N_MISSING_NAMESPACE, params.key);
    return '';
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_LANGUAGE,
        fallbackLang: FALLBACK_LANGUAGE,
        loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient, API_BASE_URL] },
        missingTranslationHandler: { provide: MissingTranslationHandler, useClass: LogMissing }
      })
    ),
  ]
};
