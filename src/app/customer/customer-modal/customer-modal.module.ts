import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerModalPageRoutingModule } from './customer-modal-routing.module';

import { CustomerModalPage } from './customer-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerModalPageRoutingModule
  ],
  declarations: [CustomerModalPage]
})
export class CustomerModalPageModule {}
