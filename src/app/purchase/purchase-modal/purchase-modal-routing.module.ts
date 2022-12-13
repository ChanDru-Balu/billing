import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseModalPage } from './purchase-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PurchaseModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PurchaseModalPageRoutingModule {}
