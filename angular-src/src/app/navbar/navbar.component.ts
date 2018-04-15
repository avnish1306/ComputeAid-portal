import { Component, OnInit } from '@angular/core';
import { faSignOutAlt, faSignInAlt, faUserPlus, faUser, faInfoCircle, faListOl, faSignal } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';

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
    private data: DataService) { }
  
  user: string;

  ngOnInit() {
    this.data.currentName.subscribe(message => this.user = message)
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  logout(){
    this.authService.logout();
  }

}
