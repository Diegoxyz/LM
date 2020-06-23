import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ODataServiceFactory } from 'angular-odata';
import { LoginSet } from '../models/OData/LoginSet/loginset.entity';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private factory: ODataServiceFactory,
    private http: HttpClient, private cartService : CartService) { 
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
  }
  
  public loginNoOData(username, password) {
    console.log('enrinment.oData:' + environment.oData);
    if (!environment.oData) {
      if ('wrong' === username) {
        return this.user;
      }
      const u : User = new User();
      u.username = username;
      u.password = password;
      u.token = 'token';
      localStorage.setItem('user', JSON.stringify(u));
      this.userSubject.next(u);
      return this.user;
    }
  }

  public login(username, password) : Observable<User>{
    console.log('enrinment.oData:' + environment.oData);
    let loginService = this.factory.create<LoginSet>("LoginSet");
    let newLoginSet : LoginSet = {
      Username : username,
      Password : password,
      Token    : '',
      Langu    : ''
    }
    this.http.get('/destinations/ZSD_SP_SRV/LoginSet',{
      observe: "response", headers: {
        'X-CSRF-Token':'Fetch'
      }
    }).subscribe(response => {
      if (response && response.headers) {
        if (response.headers) {
          console.log('X-CSRF-Token:' + response.headers.get('X-CSRF-Token'));
          const csrftoken : string = response.headers.get('X-CSRF-Token');
      
          let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrftoken,
            'Authorization': 'Basic ' + btoa('WEBAPPRIC' + 'ab123456') });
          let opt = { observe: "response" as 'body', headers: headers };
          console.log('newLoginSet:' + newLoginSet);
          console.log('loginService:' + loginService);
          this.postLogin(csrftoken,newLoginSet).subscribe(resp => {
            console.log('r:'+ resp);
            console.log('header:' + resp.headers);
            console.log('sap-message:' + resp.headers.get('sap-message'));
            console.log('body:' + resp.body);
            console.log('body.d:' + resp.body.d);
            console.log('body.d.Token:' + resp.body.d.Token);
            if (resp.body && resp.body.d && resp.body.d.Token)
            console.log('Token1:' + resp.body.Token);
            newLoginSet = { ... resp.body };
            console.log('Token2:' + newLoginSet.Token);
            if (resp.headers.get('sap-message')) {
              // C'è stato un errore e.g. password non valida
              this.user = null;
              return this.user;
            }
            if (resp.body && resp.body.d && resp.body.d.Token) {
              const u : User = new User();
              u.username = username;
              u.password = password;
              u.token = resp.body.d.Token;
              localStorage.setItem('user', JSON.stringify(u));
              this.userSubject.next(u);
              return this.user;
            }
          })
          /*loginDataSets.post(newLoginSet,options).subscribe(
            o => {
              o.forEach((v : LoginSet) => {
                console.log('v:' + v);
                if (v) {
                  console.log('v.token:' + v.Token);
                }
              });
              console.log('Token:' + o[0].Token);
              console.log('Username:' + o[0].Username);
              console.log('entries:' + o.entries[0]);
              console.log('o.values.name:' + o.values.name);
            },
          
            ([loginSet, annots ])=> { 
              console.log('type:' + annots.type);
              console.log(annots.properties);
              console.log(annots.id);
              console.log('post login set:' + loginSet);
              console.log('loginSet.token:' + loginSet.Token);
              console.log('loginSet.username:' + loginSet.Username);
              newLoginSet.Token = loginSet.token;
              console.log('newLoginSet.token:' + newLoginSet.Token);
              }
          );*/
        }
      }
    });
    /*Original code:
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return user;
        }));*/
      return null;
  }

  postLogin(csrftoken : string, newLoginSet : LoginSet ): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrftoken,
      'Authorization': 'Basic ' + btoa('WEBAPPRIC' + 'ab123456') });
    let options = { headers: headers, observe: "response" as 'body'};
    return this.http.post<HttpResponse<any>>(
      '/destinations/ZSD_SP_SRV/LoginSet', newLoginSet, options);
  }

  public logout():void{
    // TODO
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);

    this.cartService.emptyCart();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public get userLanguage(): string {
    let currentLanguage = localStorage.getItem("language");
    if (currentLanguage === undefined || currentLanguage === null) {
      currentLanguage = "english";
      localStorage.setItem('currentLanguage', 'english');
    }
    return currentLanguage;
  }

  public setUserLanguage(language : string) {
    localStorage.setItem('currentLanguage', language);
  }
}
