import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesInvoicePage } from './sales-invoice.page';

const routes: Routes = [
  {
    path: '',
    component: SalesInvoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesInvoicePageRoutingModule {}
