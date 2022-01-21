import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Customer } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customerSubject: BehaviorSubject<Customer>;
  public customer: Observable<Customer>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.customerSubject = new BehaviorSubject<Customer>(JSON.parse(localStorage.getItem('customer')!));
    this.customer = this.customerSubject.asObservable();
  }

  public set customerValue(customer: Customer) {
    this.customerSubject.next(customer);
  }

  public get customerValue(): Customer {
    return this.customerSubject.value;
  }

  public register(customer: Customer) {
    return this.http.post(`${environment.apiUrl}/customer/register`, customer);
  }

  public login(phoneNumber: number, password: string) {
    return this.http.post<Customer>(`${environment.apiUrl}/customer/authenticate`, { phoneNumber, password })
      .pipe(map(customer => {
        localStorage.setItem('customer', JSON.stringify(customer));
        this.customerSubject.next(customer);
        return customer;
      })
      )
  }

  public update(id: number, params: Customer) {
    return this.http.put(`${environment.apiUrl}/customer/${id}`, params)
      .pipe(map(res => {
        if (id == this.customerValue.id) {
          // update local storage
          const customer = { ...this.customerValue, ...params };
          localStorage.setItem('customer', JSON.stringify(customer));
          this.customerSubject.next(customer);
        }
        return res;
      })
      )
  }

  public delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/customer/${id}`)
      .pipe(map(res => {
        if (id == this.customerValue.id) {
          this.logout();
        }
        return res;
      }))
  }

  public getAll() {
    return this.http.get<Customer[]>(`${environment.apiUrl}/customer`);
  }

  public getById(id: number) {
    return this.http.get<Customer>(`${environment.apiUrl}/customer/${id}`);
  }

  public logout() {
    localStorage.removeItem('customer');
    this.customerSubject.next(null!);
    this.router.navigate(['/auth/login']);
  }

}
