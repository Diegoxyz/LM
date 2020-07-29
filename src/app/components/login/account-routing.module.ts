import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { LostCredentialsComponent } from './lost-credentials.component';
import { ChangePasswordComponent } from './change-password.component';
import { RegistrationComponent } from './registration/registration.component';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegistrationComponent },
            { path: 'lostCredentials', component: LostCredentialsComponent },
            { path: 'changePwd', component: ChangePasswordComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        { provide: APP_BASE_HREF, useValue: '!' },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
      ] 
})
export class AccountRoutingModule { }