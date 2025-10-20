import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FrontpageApi } from '../models/frontpage.types';
import { API_BASE_URL } from '../config/api-tokens';

@Injectable({ providedIn: 'root' })
export class FrontpageService {
  private http = inject(HttpClient);
  private apiBase = inject(API_BASE_URL);

  getFrontpage() {
    const url = `${this.apiBase}/frontpage`;
    return this.http.get<FrontpageApi>(url, { params: { _format: 'json', content_type: '' } });
  }
}
