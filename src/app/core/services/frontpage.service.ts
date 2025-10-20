import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FrontpageApi } from '../models/frontpage.types';

const API_BASE = 'https://api.haridusportaal.twn.zone/api';

@Injectable({ providedIn: 'root' })
export class FrontpageService {
  private http = inject(HttpClient);

  getFrontpage() {
    const url = `${API_BASE}/frontpage?_format=json&content_type=`;
    return this.http.get<FrontpageApi>(url);
  }
}
