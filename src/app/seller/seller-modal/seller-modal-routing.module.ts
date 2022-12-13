import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerModalPage } from './seller-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SellerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerModalPageRoutingModule {}
