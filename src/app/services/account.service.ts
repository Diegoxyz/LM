import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { ODataServiceFactory } from 'angular-odata';
import { LoginSet } from '../models/OData/LoginSet/loginset.entity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private factory: ODataServiceFactory, private router: Router,
    private http: HttpClient) { 
      this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      this.user = this.userSubject.asObservable();
  }
  
  public login(username, password) {
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
    let loginService = this.factory.create<LoginSet>("LoginSet");
    let loginDataSets = loginService.entities();
    let newLoginSet : LoginSet = {
      username : username,
      password : password,
      token : ''
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
            'X-CSRF-Token': csrftoken });
          let options = { headers: headers };
          console.log('newLoginSet:' + newLoginSet);
          console.log('loginService:' + loginService);
          loginDataSets.post(newLoginSet,options).subscribe(
            o => {
              o.forEach((v : LoginSet) => {
                console.log('v:' + v);
                if (v) {
                  console.log('v.token:' + v.token);
                }
              });
              console.log('entries:' + o.entries[0]);
            },
          
            ([loginSet, annots ])=> { 
              console.log('type:' + annots.type);
              console.log(annots.properties);
              console.log(annots.id);
              console.log('post login set:' + loginSet);
              console.log('loginSet.token:' + loginSet.token);
              console.log('loginSet.username:' + loginSet.username);
              newLoginSet.token = loginSet.token;
              console.log('newLoginSet.token:' + newLoginSet.token);
              }
          );
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
    return this.user;
  }
  public logout():void{
    // TODO
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

}
