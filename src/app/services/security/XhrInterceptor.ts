import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class XhrInterceptor implements HttpInterceptor {
  constructor(@Inject("backendUrl") private backendUrl: string) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headerName = "Authorization";
    const token = sessionStorage.getItem("Token");

    if (req.url === `${this.backendUrl}login`) {
      return next.handle(req);
    }

    if (token !== null && !req.headers.has(headerName)) {
      req = req.clone({ headers: req.headers.set(headerName, token) });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse, caught) => {
        console.log("Error", err);
        return next.handle(req);
      })
    );
  }
}
