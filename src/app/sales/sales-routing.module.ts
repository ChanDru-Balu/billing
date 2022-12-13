import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesPage } from './sales.page';

const routes: Routes = [
  {
    path: '',
    component: SalesPage
  },
  {
    path: 'sales-modal',
    loadChildren: () => import('./sales-modal/sales-modal.module').then( m => m.SalesModalPageModule)
  },
  {
    path: 'sales-invoice',
    loadChildren: () => import('./sales-invoice/sales-invoice.module').then( m => m.SalesInvoicePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesPageRoutingModule {}
