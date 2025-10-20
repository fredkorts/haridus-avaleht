import { Routes } from '@angular/router';
import { FrontpageComponent } from './features/frontpage/frontpage';

export const routes: Routes = [
  { path: '', component: FrontpageComponent },   // Avaleht
  { path: '**', redirectTo: '' }
];
