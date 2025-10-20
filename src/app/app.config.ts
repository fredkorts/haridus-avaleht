import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

import { TranslateLoader, TranslateModule, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Custom loader since TranslateHttpLoader v17 constructor signature changed
class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`https://api.haridusportaal.twn.zone/api/translations?_format=json&lang=${lang}`);
  }
}

function httpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

class LogMissing implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) { console.warn('[i18n missing]', params.key); return ''; }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'et',
        loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient] },
        missingTranslationHandler: { provide: MissingTranslationHandler, useClass: LogMissing }
      })
    ),
  ]
};
