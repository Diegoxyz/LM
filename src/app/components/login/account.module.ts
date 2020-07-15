import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login.component';
import { LayoutComponent } from './layout.component';
import { LoginBarComponent } from './login-bar/login-bar.component';
import { NgxPopper } from 'angular-popper';
import { FooterLoginComponent } from './footerLogin/footer-login.component';
import { ChangePasswordComponent } from './change-password.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
        NgxPopper,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
          })
    ],
    declarations: [
        LoginComponent,
        LayoutComponent,
        LoginBarComponent,
        FooterLoginComponent,
        ChangePasswordComponent,
        RegistrationComponent
    ]
})
export class AccountModule { }