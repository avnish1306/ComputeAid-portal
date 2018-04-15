import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChalService } from '../services/chal.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-add-chal',
  templateUrl: './add-chal.component.html',
  styleUrls: ['./add-chal.component.css']
})
export class AddChalComponent implements OnInit {

  constructor(private chalService: ChalService,
    private router: Router,
    private notificationsService: NotificationsService) { }

  addChalForm: FormGroup;

  ngOnInit() {
    this.addChalForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required]),
      'flag': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required])
    });
  }

  addChal(navigate: boolean){
    const chal = {
      title: this.addChalForm.value.title,
      desc: this.addChalForm.value.desc,
      flag: this.addChalForm.value.flag,
      points: this.addChalForm.value.points,
      author: this.addChalForm.value.author
    }
    this.chalService.addChal(chal).subscribe(
      data => {
        this.addChalForm.reset();
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        if(navigate)
          this.router.navigate(['/chals']);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
