import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { Customer } from 'src/app/shared/models';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public customer: Customer;
  public customers: any[];

  constructor(private customerService: CustomerService) {
    this.customer = this.customerService.customerValue;
  }

  ngOnInit() {
    this.customerService.getAll()
      .pipe(first())
      .subscribe(customers => this.customers = customers);

  }

  public onDelete(id: number) {
    const customer = this.customers.find((res: any) => res.id === id);
    customer.isDeleting = true;
    this.customerService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.customers = this.customers.filter((res: any) => res.id !== id)
      })
  }
}
