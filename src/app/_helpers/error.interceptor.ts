import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { ODataSettingsService } from './oDataSettings.service';
import { environment } from '@environments/environment';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService, private oDataSettingsService : ODataSettingsService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let username = environment ? environment.oDataUsername : ''; // 'WEBAPPRIC';
        let password = environment ? environment.oDataPassword : ''; // 'ab123456'
        
        request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + btoa(username + password)) });

            return next.handle(request).pipe(map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    if (event.headers && event.headers.get('sap-message')) {
                        console.log('sap-message:' + event.headers.get('sap-message'));
                        this.accountService.logout();
                    }
                }
                return event;
                }),catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // auto logout if 401 response returned from api
                    this.accountService.logout();
                }
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = error.error.message;
                  } else {
                    // server-side error
                    errorMessage = error.status + '-' + error.message;
                  }
                console.log('catched error:' + errorMessage);
                window.alert(errorMessage);
                return throwError(errorMessage);
            }))
    }

}