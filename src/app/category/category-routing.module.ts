import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryPage } from './category.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryPage
  },
  {
    path: 'cat-modal',
    loadChildren: () => import('./cat-modal/cat-modal.module').then( m => m.CatModalPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryPageRoutingModule {}
