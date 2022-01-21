import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Customer } from '../shared/models';

let currentCustomer = JSON.parse(localStorage.getItem('customers')!) || [];

@Injectable()
export class ApiHandlerInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    /*
      wrap in delayed observable to simulate server api call

      materialize call materialize and dematerialize to ensure delay even if an error is thrown
    */
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/customer/authenticate') && method === 'POST':
          return authenticate();

        case url.endsWith('/customer/register') && method === 'POST':
          return register();

        case url.endsWith('/customer') && method === 'GET':
          return getCustomer();

        case url.match(/\/customer\/\d+$/) && method === 'GET':
          return getCustomerById();

        case url.match(/\/customer\/\d+$/) && method === 'PUT':
          return updateCustomer();
          
        case url.match(/\/customer\/\d+$/) && method === 'DELETE':
          return deleteCustomer();
        default:
          return next.handle(request);
      }
    }

    // get way api handler
    function authenticate() {
      const { phoneNumber, password } = body;
      const customer = currentCustomer.find((res: Customer) => res.phoneNumber === phoneNumber && res.password === password);
      if (!customer) return error('PhoneNumber or password is incorrect');
      
      return ok({
        id: customer.id,
        phoneNumber: customer.phoneNumber,
        firstName: customer.firstName,
        lastName: customer.lastName,
        token: 'mock-token'
      })
    }

    function register() {
      const customer = body

      if (currentCustomer.find((res: Customer) => res.phoneNumber === customer.phoneNumber)) {
        return error('PhoneNumber "' + customer.phoneNumber + '" is already taken')
      }

      if (currentCustomer.find((res: Customer) => res.email === customer.email)) {
        return error('E-Mail "' + customer.email + '" is already taken')
      }

      if (currentCustomer.find((res: Customer) => 
        (res.firstName === customer.firstName) && (res.lastName === customer.lastName) && (res.dateOfBirth === customer.dateOfBirth))) 
      {
        return error(`Customer ${customer.firstName} With : ${customer.dateOfBirth} is already taken`)
      }

      customer.id = currentCustomer.length ? Math.max(...currentCustomer.map((x: any) => x.id)) + 1 : 1;
      currentCustomer.push(customer);
      localStorage.setItem('customers', JSON.stringify(currentCustomer));
      return ok();
    }

    function getCustomer() {
      if (!isLoggedIn()) return unauthorized();
      
      return ok(currentCustomer);
    }

    function getCustomerById() {
      if (!isLoggedIn()) return unauthorized();

      const customer = currentCustomer.find((res: any) => res.id === idFromUrl());
      return ok(customer);
    }

    function updateCustomer() {
      if (!isLoggedIn()) return unauthorized();

      let params = body;
      let customer = currentCustomer.find((res: any) => res.id === idFromUrl());

      // only update password if entered
      if (!params.password) {
        delete params.password;
      }

      // update and save customer
      Object.assign(customer, params);
      localStorage.setItem('customers', JSON.stringify(currentCustomer));

      return ok();
    }

    function deleteCustomer() {
      if (!isLoggedIn()) return unauthorized();

      currentCustomer = currentCustomer.filter((x: any) => x.id !== idFromUrl());
      localStorage.setItem('customers', JSON.stringify(currentCustomer));
      return ok();
    }

    /**** response handler ****/
    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }))
    }

    function error(message: string) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer mock-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}
