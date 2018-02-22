import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(@Inject('authService') private auth,
              private router: Router) { }
    
  canActivate(){
    if(this.auth.isAuthenticated()){
      return true;
    } else {
      this.router.navigate['/'];
    }
  }

}