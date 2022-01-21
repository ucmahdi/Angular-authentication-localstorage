import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomerService } from '../shared/services/customer.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private customerService: CustomerService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const customer = this.customerService.customerValue;
    const isLoggedIn = customer && customer.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${customer.token}`
        }
      });
    }

    return next.handle(request);
  }
}