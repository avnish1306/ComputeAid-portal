import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications/dist/';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService) {}

  ngOnInit() {
    if(this.authService.isLoggedIn())
      this.router.navigate(['/chals']);
    this.registerForm = new FormGroup({
      'name': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(null, [Validators.required, Validators.pattern(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)]),
      'password': new FormGroup({
        'password1': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'password2': new FormControl(null, [Validators.required, Validators.minLength(6)])
      }, this.matchPasswords),
      'contact': new FormControl(null, [Validators.required, Validators.pattern(/^(\+?91|0)?[6789]\d{9}$/)]),
      'college': new FormControl(null, Validators.required),
      'lang': new FormControl(null,Validators.required)
    });
  }

  matchPasswords(group: FormGroup): {[s: string]: boolean}{
    if(group.controls.password1.value !== group.controls.password2.value)
      return {'notMatch': true}
    return null;
  }

  register(){
    const user = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      contact: this.registerForm.value.contact,
      password1: this.registerForm.value.password.password1,
      password2: this.registerForm.value.password.password2,
      college: this.registerForm.value.college,
      lang: this.registerForm.value.lang
    }
    this.authService.registerUser(user).subscribe(
      data => {
        this.notificationsService.success("Congratulations!!", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.router.navigate(['/login']);
      },
      error => {
        this.notificationsService.warn("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
