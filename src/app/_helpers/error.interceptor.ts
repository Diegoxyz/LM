import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + btoa('WEBAPPRIC' + 'ab123456')) });

        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                console.log('event--->>>', event);
                if (event.headers && event.headers.get('sap-message')) {
                    this.accountService.logout();
                }
            }
            return event;
            }),catchError(err => {
            console.log('catched error');
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.accountService.logout();
            }
            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}