import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {GeoMapViewComponent} from '../geo-map-view/geo-map-view.component';
import {GeoMapDetailComponent} from '../geo-map-detail/geo-map-detail.component';


const routes: Routes = [
  {
    path: '',
    component: GeoMapViewComponent,
  },
  {
    path: 'geomapdetail/:id/:hotspotfile',
    component: GeoMapDetailComponent
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
