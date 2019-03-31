import { Component, OnInit } from '@angular/core';
import { faSignOutAlt, faSignInAlt, faUserPlus, faUser, faInfoCircle, faListOl, faSignal } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

fontawesome.library.add(faSignOutAlt, faSignInAlt, faUserPlus, faUser, faInfoCircle, faListOl, faSignal);

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService,
    private data: DataService,private router: Router) { }
  
  user: string;
  contest;

  ngOnInit() {
    this.data.currentName.subscribe(message => this.user = message);
    this.contest=this.router.url;
    console.log(this.contest);
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout(){
    this.authService.logout();
  }

}
