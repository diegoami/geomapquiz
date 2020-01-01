import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {CarPageComponent} from '../car-page/car-page.component';
import {CarDashboardComponent} from '../car-dashboard/car-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CarPageComponent,
  },
  {
    path: 'dashboard',
    component: CarDashboardComponent,
  },

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
