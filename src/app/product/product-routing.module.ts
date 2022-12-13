import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  },
  {
    path: 'prod-modal',
    loadChildren: () => import('./prod-modal/prod-modal.module').then( m => m.ProdModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductPageRoutingModule {}
