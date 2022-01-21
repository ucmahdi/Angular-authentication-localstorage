import { Component } from '@angular/core';
import { Customer } from 'src/app/shared/models';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  template: `
  <div style="background-color: #333;" class="top-line">
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-sm-6 col-xs-6 mt-2">
          <h3 style="color: bisque">Hi {{customer.firstName}} Welcome!</h3>
        </div>
      </div>
    </div>
  </div>
  <router-outlet></router-outlet>
` })

export class MainWrapperComponent {
  public customer: Customer;
  constructor(private customerService: CustomerService) {
    this.customer = this.customerService.customerValue;
  }
}
