import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CustomerService } from '../shared/services/customer.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private customerService: CustomerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) this.customerService.logout();

      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }
}