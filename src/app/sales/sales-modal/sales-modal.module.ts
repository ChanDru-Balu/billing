import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesModalPageRoutingModule } from './sales-modal-routing.module';

import { SalesModalPage } from './sales-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalesModalPageRoutingModule
  ],
  declarations: [SalesModalPage]
})
export class SalesModalPageModule {}
