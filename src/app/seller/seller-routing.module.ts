import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerPage } from './seller.page';

const routes: Routes = [
  {
    path: '',
    component: SellerPage
  },
  {
    path: 'seller-modal',
    loadChildren: () => import('./seller-modal/seller-modal.module').then( m => m.SellerModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerPageRoutingModule {}
