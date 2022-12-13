import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PurchaseModalPageRoutingModule } from './purchase-modal-routing.module';

import { PurchaseModalPage } from './purchase-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PurchaseModalPageRoutingModule
  ],
  declarations: [PurchaseModalPage]
})
export class PurchaseModalPageModule {}
