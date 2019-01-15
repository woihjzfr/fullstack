// app/auth.service.ts
import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
// import * as auth0 from 'auth0-js';
const auth0 = require('auth0-js');

(window as any).global = window;
// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Configure Auth0
  // clientId = 'JWzeB7Xo6CCeHeLCeMBwY39BM3xSGFyi';
    clientId: 'Rod2jbESV53Ji8uJ10tuOp0U7vavY7q7'
  // domain = 'songhu.auth0.com'
  domain: 'woihjzfr74.auth0.com'
  // lock = new Auth0Lock(this.clientId, this.domain, {});

  auth0 = new auth0.WebAuth({
    clientID: 'Rod2jbESV53Ji8uJ10tuOp0U7vavY7q7',
    domain: 'woihjzfr74.auth0.com',
    // clientID: AUTH_CONFIG.clientID,
    // domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    // redirectUri: AUTH_CONFIG.callbackURL

    redirectUri:'http://localhost:3000/home'
  });

  constructor(private http : Http) {
  }

  public login(): void {
  this.auth0.authorize();
}

// public login(): Promise<Object> {
//   // this.auth0.authorize();
//   return new Promise((resolve, reject) => {
//     // Call the show method to display the widget.
//     this.auth0.parseHash((error: string, authResult) => {
//       console.log("aaabcccd");
//       console.log(authResult.idToken);
//       if (error) {
//         reject(error);
//       } else {
//         localStorage.setItem('profile', JSON.stringify(authResult.idToken));
//         localStorage.setItem('id_token', authResult.idToken);
//         resolve(authResult.idToken);
//       }
//     });
//   })
// }

public handleAuthentication(): void {
  this.auth0.parseHash((err, authResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      this.setSession(authResult);
      // this.router.navigate(['/home']);
    } else if (err) {
      // this.router.navigate(['/home']);
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
    }
  });
}
private setSession(authResult): void {
  // Set the time that the access token will expire at
  const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.accessToken);
  localStorage.setItem('id_token', authResult.idToken);
  localStorage.setItem('expires_at', expiresAt);
  localStorage.setItem('profile',  JSON.stringify(authResult.idTokenPayload));
}

  // public login(): Promise<Object> {
  //   return new Promise((resolve, reject) => {
  //     // Call the show method to display the widget.
  //     this.auth0.show((error: string, profile: Object, id_token: string) => {
  //       if (error) {
  //         reject(error);
  //       } else {
  //         localStorage.setItem('profile', JSON.stringify(profile));
  //         localStorage.setItem('id_token', id_token);
  //         resolve(profile);
  //       }
  //     });
  //   })
  // }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public isAuthenticated(): boolean {
  // Check whether the current time is past the
  // access token's expiry time
  const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
  return new Date().getTime() < expiresAt;
}

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }

  // public getProfile(): any {
  //   return JSON.parse(localStorage.getItem('profile'));
  // }

  // src/app/auth/auth.service.ts

// ...
userProfile: any;

//...
public getProfile(cb): void {
  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) {
    throw new Error('Access Token must exist to fetch profile');
  }

  const self = this;
  this.auth0.client.userInfo(accessToken, (err, profile) => {
    if (profile) {
      self.userProfile = profile;
    }
    cb(err, profile);
  });
}

  public resetPassword() {
    // let profile = this.getProfile();
    let url : string = `https://${this.domain}/dbconnections/change_password`;
    let headers = new Headers({'content-type': 'application/json'});
    let body = {
      client_id: this.clientId,
      // email: profile.email,
      connection: 'Username-Password-Authentication'
    }

    this.http.post(url, body, headers)
      .toPromise()
      .then((res: Response) => {
          console.log(res.json());
      })
      .catch(this.handleError);
  }

  private handleError(error : any) : Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
