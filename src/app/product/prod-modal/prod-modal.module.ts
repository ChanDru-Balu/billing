import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdModalPageRoutingModule } from './prod-modal-routing.module';

import { ProdModalPage } from './prod-modal.page';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdModalPageRoutingModule,
    NgSelectModule
  ],
  declarations: [ProdModalPage]
})
export class ProdModalPageModule {}
