import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { ODataSettingsService } from './oDataSettings.service';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService, private translateService : TranslateService, private spinner: NgxSpinnerService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let username = environment ? environment.oDataUsername : ''; // 'WEBAPPRIC';
        let password = environment ? environment.oDataPassword : ''; // 'ab123456'
        
        request = request.clone({ headers: request.headers.set('Authorization', 'Basic ' + btoa(username + password)) });

            return next.handle(request).pipe(map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                    if (event.headers && event.headers.get('sap-message')) {
                        const sapMessage = event.headers.get('sap-message');
                        console.log('error interceptor sap-message:' + sapMessage);
                        /*if (sapMessage.code === 'ZSPB2B/000') {
                            this.accountService.logout();
                        }*/
                        this.accountService.checkSession();
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
                    console.log('client side error');
                    // client-side error
                    errorMessage = error.error.message + ':' + error.message + ':' + error.url;
                  } else {
                    console.log('server side error:' + error.error);
                    if (error.error) {
                        console.log('server side error message:' + error.error.message);
                    }
                    // server-side error
                    errorMessage = error.status + '-' + error.message + '-' + error.statusText;
                  }
                console.error('catched error:' + errorMessage);
                /*if (!(error.error instanceof ErrorEvent)) {
                    return Observable.throw(error);
                }*/
                
                errorMessage = this.translateService.instant('unknownError');
                // window.alert(errorMessage);
                this.spinner.hide();
                return throwError(errorMessage);
            }))
    }

}