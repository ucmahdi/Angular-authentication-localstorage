import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrEditComponent } from './add-or-edit/add-or-edit.component';
import { CustomersComponent } from './customers/customers.component';
import { MainWrapperComponent } from './main-wrapper.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user-managment'
  },
  {
    path: 'user-managment',
    component: MainWrapperComponent,
    children: [
      {
        path: '',
        component: CustomersComponent
      },
      {
        path: 'add',
        component: AddOrEditComponent
      },
      {
        path: 'edit/:id',
        component: AddOrEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainWrapperRoutingModule { }
