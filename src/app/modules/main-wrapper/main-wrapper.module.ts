import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainWrapperRoutingModule } from './main-wrapper-routing.module';
import { AddOrEditComponent } from './add-or-edit/add-or-edit.component';
import { MainWrapperComponent } from './main-wrapper.component';
import { CustomersComponent } from './customers/customers.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MainWrapperComponent,
    AddOrEditComponent,
    CustomersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainWrapperRoutingModule
  ]
})
export class MainWrapperModule { }
