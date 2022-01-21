import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';

import { CustomerService } from 'src/app/shared/services/customer.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({ templateUrl: './add-or-edit.component.html' })

export class AddOrEditComponent implements OnInit {
  public isAddMode: boolean;
  public form: FormGroup;
  public loading = false;
  private id: number;

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.createForm()
    this.findCustomer()
  }

  private createForm() {
    const passwordValidators = [Validators.minLength(6)];
    if (this.isAddMode) {
      passwordValidators.push(Validators.required);
    }

    this.form = this.formBuilder.group({
      password: ['', passwordValidators],
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  private findCustomer() {
    if (!this.isAddMode) {
      this.customerService.getById(this.id)
        .pipe(first())
        .subscribe(res => {
          this.form.patchValue({
            email: res.email,
            lastName: res.lastName,
            firstName: res.firstName,
            dateOfBirth: res.dateOfBirth,
            phoneNumber: res.phoneNumber,
            bankAccountNumber: res.bankAccountNumber
          })
        })
    }
  }

  public onSubmit() {
    this.alertService.clear();

    if (this.form.invalid) return;
    this.loading = true;

    if (this.isAddMode) this.createUser();
    else this.updateUser();
  }

  private createUser() {
    this.customerService.register(this.form.value)
      .pipe(first())
      .subscribe(
        res => {
          this.alertService.success('User added successfully', { keepAfterRouteChange: true });
          this.router.navigate(['.', { relativeTo: this.route }]);
        },
        err => {
          this.alertService.error(err);
          this.loading = false;
        })
  }

  private updateUser() {
    this.customerService.update(this.id, this.form.value)
      .pipe(first())
      .subscribe(
        res => {
          this.alertService.success('Update successful', { keepAfterRouteChange: true });
          this.router.navigate(['..', { relativeTo: this.route }]);
        },
        err => {
          this.alertService.error(err);
          this.loading = false;
        })
  }
}
