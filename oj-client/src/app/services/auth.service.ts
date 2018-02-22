import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';

var  webAuth = new auth0.WebAuth({
  domain:'sylvia0409.auth0.com',
  clientID:'YxjWtync6TNCv7dN5YRzS2TjMSRQpwVU'
});

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: 'YxjWtync6TNCv7dN5YRzS2TjMSRQpwVU',
    domain: 'sylvia0409.auth0.com',
    responseType: 'token id_token',
    audience: 'https://sylvia0409.auth0.com/userinfo',
    redirectUri: 'http://localhost:3000',
    scope: 'openid profile'
  });

  constructor(public router: Router) { 
    
  }

  public login() {   
    this.auth0.authorize();
  }
  
  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''; 
        this.setSession(authResult);
        webAuth.client.userInfo(authResult.accessToken, function(err, user) {
          localStorage.setItem('profile', JSON.stringify(user));
        });
        this.router.navigate(['/problems']);
        
      } else if (err) {
        this.router.navigate(['/problems']);
        console.log(err);
        
      }
    });
  }
 
  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  } 

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('profile');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  public getUsername(){
    return JSON.parse(localStorage.getItem('profile'));
  }

  

}
