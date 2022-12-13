import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdModalPage } from './prod-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ProdModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdModalPageRoutingModule {}
