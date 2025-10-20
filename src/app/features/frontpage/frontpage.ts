import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { FrontpageService } from '../../core/services/frontpage.service';
import { FrontpageVM } from '../../core/models/frontpage.types';
import { mapFrontpage } from './frontpage.mapper';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-frontpage',
  templateUrl: './frontpage.html',
  styleUrls: ['./frontpage.scss'],
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class FrontpageComponent {
  private svc = inject(FrontpageService);
  vm$: Observable<FrontpageVM> = this.svc.getFrontpage().pipe(map(mapFrontpage));
}
