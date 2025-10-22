import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { FrontpageService } from './frontpage.service';
import { API_BASE_URL } from '../config/api-tokens';
import { FrontpageApi } from '../models/frontpage.types';

describe('FrontpageService', () => {
  let service: FrontpageService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FrontpageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '/api' }
      ]
    });

    service = TestBed.inject(FrontpageService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('calls the frontpage endpoint once and returns the response body', () => {
    const mockResponse = { content: { title: 'Frontpage' } } as FrontpageApi;
    let received: FrontpageApi | undefined;

    service.getFrontpage().subscribe(res => {
      received = res;
    });

    const req = httpController.expectOne(request => request.url === '/api/frontpage');

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('_format')).toBe('json');
    expect(req.request.params.get('content_type')).toBe('');

    req.flush(mockResponse);

    expect(received).toEqual(mockResponse);
  });
});
