import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LostCredentialsComponent } from './components/login/lost-credentials.component';
import { AuthGuard } from './_helpers/auth.guard';

const accountModule = () => import('./components/login/account.module').then(x => x.AccountModule);
const homeModule = () => import('./components/home/home.module').then(x => x.HomeModule);

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [AuthGuard]},
  { path: 'account', loadChildren: accountModule },
  { path: 'home', loadChildren: homeModule, canActivate: [AuthGuard]},
  { path: 'catalogue', loadChildren: homeModule, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
