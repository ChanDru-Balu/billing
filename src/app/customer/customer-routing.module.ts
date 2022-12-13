import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPage } from './customer.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPage
  },
  {
    path: 'customer-modal',
    loadChildren: () => import('./customer-modal/customer-modal.module').then( m => m.CustomerModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPageRoutingModule {}
