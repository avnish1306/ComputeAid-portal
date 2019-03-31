import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuesService } from '../services/ques.service';
import { NotificationsService } from 'angular2-notifications/dist/';
@Component({
  selector: 'app-add-que',
  templateUrl: './add-que.component.html',
  styleUrls: ['./add-que.component.css']
})
export class AddQueComponent implements OnInit {
  constructor(private queService: QuesService,
    private router: Router,
    private notificationsService: NotificationsService) { }

  addQueForm: FormGroup;

  ngOnInit() {
    this.addQueForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required]),
      'flag': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required])
    });
  }

  addQue(navigate: boolean){
    const que = {
      title: this.addQueForm.value.title,
      desc: this.addQueForm.value.desc,
      flag: this.addQueForm.value.flag,
      points: this.addQueForm.value.points,
      author: this.addQueForm.value.author
    }
    this.queService.addQue(que).subscribe(
      data => {
        this.addQueForm.reset();
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        if(navigate)
          this.router.navigate(['/ques']);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
