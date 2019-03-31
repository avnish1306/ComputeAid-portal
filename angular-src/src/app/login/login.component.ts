import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications/dist/';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService,
    private dataService: DataService){}

  ngOnInit() {
    if(this.authService.isLoggedIn())
      this.router.navigate(['/chals']);
    this.loginForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  login(){
    const user = {
      name: this.loginForm.value.name,
      password: this.loginForm.value.password
    }

    this.authService.loginUser(user).subscribe(
      data => {
        this.authService.storeUserData(data.token);
        this.dataService.changeName(user.name);
        this.router.navigate(['/chals']);
      },
      error => {
        this.notificationsService.warn("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }
  
}
