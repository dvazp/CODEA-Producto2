import { Routes } from '@angular/router';
import { PlayersComponent } from './playersComponent/playersComponent';
import { DetailComponent } from './detailComponent/detailComponent';

export const routes: Routes = [
  { path: '', component: PlayersComponent },
  // route with a parameter (player nombre) so the detail view can show different content
  { path: 'detail/:nombre', component: DetailComponent }
];