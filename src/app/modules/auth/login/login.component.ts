import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { AlertService } from 'src/app/shared/services/alert.service';

@Component({ templateUrl: 'login.component.html' })

export class LoginComponent implements OnInit {
  public form: FormGroup;
  public loading = false;
  public returnUrl: string;

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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  private createForm() {
    this.form = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(9)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  public onSubmit() {
    this.alertService.clear();
    if (this.form.invalid) return;

    this.loading = true;
    this.customerService.login(this.form.value.phoneNumber, this.form.value.password)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      )
  }
}
