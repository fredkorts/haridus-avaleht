import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppComponent } from './app';

class StaticTranslateLoader implements TranslateLoader {
  getTranslation() {
    return of({});
  }
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: StaticTranslateLoader }
        })
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the app shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const appShell = compiled.querySelector('.app-shell');
    expect(appShell).toBeTruthy();
  });

  it('should render navigation component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navigation = compiled.querySelector('app-navigation');
    expect(navigation).toBeTruthy();
  });
});
