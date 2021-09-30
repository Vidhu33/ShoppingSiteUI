import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 
@Injectable()
export class UserService {
 
  private httpOptions: any;
  public token: any;
  public token_expires: Date | undefined;
  public username: string | undefined;
 
  // error messages received from the login attempt
  public errors: any = [];
 
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
 
  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user: { username: any; password: any; }) {
    this.http.post('/api-token-auth/', JSON.stringify(user), this.httpOptions)
    .subscribe((data: any) => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    this.http.post('/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions)
    .subscribe((data: any) => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  public logout() {
    this.token = null;
    this.token_expires = undefined;
    this.username = undefined;
  }
 
  private updateData(token: any) {
    this.token = token;
    this.errors = [];
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }
 
}