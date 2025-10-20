import { Routes } from '@angular/router';
import { FrontpageComponent } from './features/frontpage/frontpage';
import { TestPageComponent } from './features/test-page/test-page';

export const routes: Routes = [
  { path: '', component: FrontpageComponent },
  { path: 'test', component: TestPageComponent },
  { path: '**', redirectTo: '' }
];
