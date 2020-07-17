import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserReq } from '../models/user';
import { ODataServiceFactory } from 'angular-odata';
import { LoginSet } from '../models/OData/LoginSet/loginset.entity';
import { environment } from 'src/environments/environment';
import { CartService } from './cart.service';
import {TranslateService} from '@ngx-translate/core';
import buildQuery from 'odata-query';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private factory: ODataServiceFactory,
    private http: HttpClient, private cartService : CartService,private translateService: TranslateService) { 
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
  }
  
  public loginWOOData(username, password) {
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
    
    this.http.get(environment.oData_destination + 'LoginSet',{
      observe: "response", headers: {
        'X-CSRF-Token':'Fetch'
      }
    }).subscribe(response => {
      if (response && response.headers) {
        if (response.headers) {
          console.log('X-CSRF-Token:' + response.headers.get('X-CSRF-Token'));
          const csrftoken : string = response.headers.get('X-CSRF-Token');
      
          this.postLogin(csrftoken,username,password).subscribe(resp => {
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
              u.lang = resp.body.d.Langu;
              localStorage.setItem('user', JSON.stringify(u));
              this.userSubject.next(u);
              return this.user;
            }
            return null;
          })
        }
      }
    },
    error => {
      return null;
    });
    return null;
  }

  public fetchToken() : Observable<any>{
    return this.http.get(environment.oData_destination + 'LoginSet',{
      observe: "response", headers: {
        'X-CSRF-Token':'Fetch'
      }
    });
  }

  public logIn(csrftoken : string, username : string, password : string) {
    const u : User = new User();
    this.postLogin(csrftoken,username,password).subscribe(response => {
      if (response.headers.get('sap-message')) {
        // C'è stato un errore e.g. password non valida
        u.username = '';
        u.password = '';
        u.token = "";
      }
      if (response.body && response.body.d && response.body.d.Token) {
        u.username = username;
        u.password = password;
        u.token = response.body.d.Token;
        localStorage.setItem('user', JSON.stringify(u));
        this.userSubject.next(u);
        
      }
      return "";
    });
    return null;
  }
  postLogin(csrftoken : string, username : string, password : string ): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrftoken });
    let options = { headers: headers, observe: "response" as 'body'};
    let loginSet : LoginSet = {
      Username : username,
      Password : password,
      Token    : '',
      Langu    : this.getLanguage()
    }
    return this.http.post<HttpResponse<any>>(
      environment.oData_destination + 'LoginSet', loginSet, options);
  }

  public changePassword(username: string, oldPassword: string, newPassword: string, token : string, lang : string, csrftoken : string): Observable<HttpResponse<any>> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrftoken });
    let options = { headers: headers, observe: "response" as 'body'};
    let loginSet = {
      Username : username,
      PasswordOld : oldPassword,
      PasswordNew: newPassword,
      Token    : token,
      Langu    : lang
    }
    return this.http.post<HttpResponse<any>>(
      environment.oData_destination + 'ChangePswSet', loginSet, options);
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

  public setUserValue(username : string, password : string, token: string, lang: string) {
    const u : User = new User();
    u.username = username;
    u.password = password;
    u.token = token;
    u.lang = lang;
    localStorage.setItem('user', JSON.stringify(u));
    this.translateService.use(this.convertSAPLanguageConvention(lang));
    this.userSubject.next(u);
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

  public isSessionStillValid() : boolean {
    if (this.userValue === undefined || this.userValue === null || this.user === undefined || this.user === null) {
      console.log('isSessionStillValid - return false');
      return false;
    }
    return true;
  }

  /**
     * It returns the user language if any otherwise the browser language
     */
  public getLanguage() : string {
      const u : User = this.userValue;
      if (u && u.lang) {
          return this.convertSAPLanguageConvention(u.lang);
      } else {
          return this.getBrowserLanguage();
      }
  }

  /** 
     * Da essere utilizzato quando l'utente non è ancora loggato, 
     * restituisce il linguaggio o 'IT' o 'EN', sono i soli riconosciuti dal BE
     */
    public getBrowserLanguage() : string {
      const lang = navigator.language;
      console.log('getBrowserLanguage - lang:' + lang);
      if (lang) {
          if (lang === 'it-IT') {
              return 'it';
          } else if (lang === 'it') {
              return 'it';
          }
      }
      return 'en';
  }

  public convertSAPLanguageConvention(input : string) : string {
    let output = '';
    if (input.toUpperCase() === 'I') {
      output = 'it';
    } else if (input.toUpperCase() === 'IT') {
      output = 'it';
    } else if (input.toUpperCase() === 'E') {
      output = 'en';
    } else if (input.toUpperCase() === 'EN') {
      output = 'en';
    } else {
      output = input;
    }
    console.log('convertSAPLanguageConvention - input:' + input + ',output:' + output);
    return output;
  }

  public registration(csrftoken : string, userReq : UserReq) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrftoken });
    let options = { headers: headers, observe: "response" as 'body'};
    return this.http.post<HttpResponse<any>>(
      environment.oData_destination + 'UserReqSet', userReq, options);
  }

  public lostCredentials(csrftoken : string, email : string) : Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrftoken });
    
    let url = '';
    const langu = 'Langu=' + '\'' + this.getBrowserLanguage().toUpperCase() + '\'';
    const em    = 'Email=' + '\'' + email + '\'';
    url = url.concat('(').concat(em).concat(',').concat(langu).concat(')').concat();
    console.log('lostcredentials - url:' + url);
    let options = { headers: headers, observe: "response" as 'body'};
    return this.http.get<HttpResponse<any>>(
      environment.oData_destination + 'LostPswSet' + url, options);
  }
}
