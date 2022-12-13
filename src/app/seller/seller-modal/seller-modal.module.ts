import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerModalPageRoutingModule } from './seller-modal-routing.module';

import { SellerModalPage } from './seller-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerModalPageRoutingModule
  ],
  declarations: [SellerModalPage]
})
export class SellerModalPageModule {}
