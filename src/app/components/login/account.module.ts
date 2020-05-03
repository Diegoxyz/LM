import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { LayoutComponent } from './layout.component';
import { LoginBarComponent } from './login-bar/login-bar.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        LayoutComponent,
        LoginBarComponent
    ]
})
export class AccountModule { }