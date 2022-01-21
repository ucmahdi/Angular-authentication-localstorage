import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from 'src/app/shared/services/alert.service';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({ templateUrl: 'register.component.html' })

export class RegisterComponent implements OnInit {
  public form: FormGroup;
  public loading = false;

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.customerService.customerValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.createForm()
  }

  private createForm() {
    this.form = this.formBuilder.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]]
    });
  }

  public onSubmit() {
    this.alertService.clear();

    if (this.form.invalid) return;

    this.loading = true;
    this.customerService.register(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful', { keepAfterRouteChange: true });
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      )
  }
}
