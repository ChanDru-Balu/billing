import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerModalPage } from './customer-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerModalPageRoutingModule {}
