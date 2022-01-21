import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";

import { AlertComponent } from "./components/alert/alert.component";
import { SharedModule } from "../shared/shared.module";
import { TokenInterceptor } from "./token.interceptor";
import { ErrorInterceptor } from "./arror.interceptor";
import { ApiHandlerInterceptor } from "./api-handler";

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    AlertComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // create fake backend
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHandlerInterceptor,
      multi: true
    }
  ]
})

export class CoreModule { }
