import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesInvoicePageRoutingModule } from './sales-invoice-routing.module';

import { SalesInvoicePage } from './sales-invoice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesInvoicePageRoutingModule
  ],
  declarations: [SalesInvoicePage]
})
export class SalesInvoicePageModule {}
