import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title: string = 'COJ System';
  username: string = 'ssy';

  constructor(@Inject('authService') private authService) {
    if(this.authService.isAuthenticated()){
      this.username = this.authService.getUsername().nickname;
    }
    authService.handleAuthentication();
   }

  ngOnInit() {
  }

  login() {
    this.authService.login();
  }

  logout(){
    this.authService.logout();
  }
}
