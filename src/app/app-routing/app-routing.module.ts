import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {GeoMapViewComponent} from '../geo-map-view/geo-map-view.component';


const routes: Routes = [
  {
    path: '',
    component: GeoMapViewComponent,
  }

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
