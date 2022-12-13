import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesModalPage } from './sales-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SalesModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesModalPageRoutingModule {}
