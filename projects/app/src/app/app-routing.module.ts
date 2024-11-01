import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateComponent } from 'state';
import { MapComponent } from 'map';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MapComponent,
  },
  {
    path: 'state/:stateName',
    component: StateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
