import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications/dist/';
import { faPlusCircle, faTrash, faPencilAlt, faEye } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';

import { AuthService } from '../services/auth.service';
import { ChalService } from '../services/chal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

fontawesome.library.add(faPlusCircle, faTrash, faPencilAlt, faEye);

@Component({
  selector: 'app-chals',
  templateUrl: './chals.component.html',
  styleUrls: ['./chals.component.css']
})
export class ChalsComponent implements OnInit {

  constructor(private router: Router,
  private authService: AuthService,
  private chalService: ChalService,
  private notificationsService: NotificationsService) { }

  chals;
  selected: boolean = false;
  title: string;
  points: number;
  desc: string = "<h2>Welcome</h2><h3>to</h3><h1>CryptoQuest</h1><br><br><p>Click on any question to begin</p>";
  author: string;
  users = [];
  id: string;
  solved;
  isSolved: boolean = false;
  index: number;
  flags;

  flagForm: FormGroup;
  addChalForm: FormGroup;

  ngOnInit() {
    this.chalService.getAllChals().subscribe(
      data => {
        this.chals = data.chals;
        this.solved = new Array(this.chals.length).fill(false);
        this.flags = new Array(this.chals.length).fill("");
        for(let i=0;i<this.chals.length;i++){
          this.solved[i] = (this.chals[i].users.indexOf(JSON.parse(localStorage.getItem('user')).name) > -1);
        }
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error, "");
      }
    );
    this.flagForm = new FormGroup({
      'flag': new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
    this.addChalForm = new FormGroup({
      'title': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'flag': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required])
    });
  }

  displayChal(index){
    this.index = index;
    this.selected = true;
    this.title = this.chals[index].title;
    this.points = this.chals[index].points;
    this.author = this.chals[index].author;
    this.desc = this.chals[index].desc;
    this.users = this.chals[index].users;
    this.id = this.chals[index]._id;
    this.isSolved = this.solved[index];
    if(this.isAdmin()){
      if(this.flags[index]=="")
        this.viewFlag();
    }
  }

  submitFlag(){
    this.chalService.submitFlag(this.id, this.flagForm.value.flag).subscribe(
      data => {
        if(data.solved){
          this.notificationsService.success("Yahoo!!", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
          this.solved[this.index] = true;
          this.isSolved = true;
          this.flagForm.reset();
        }
        else
          this.notificationsService.error("Sigh!!", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  addChal(){
    const chal = {
      title: this.addChalForm.value.title,
      desc: this.addChalForm.value.desc,
      flag: this.addChalForm.value.flag,
      points: this.addChalForm.value.points,
      author: this.addChalForm.value.author
    }
    this.chalService.addChal(chal).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.addChalForm.reset();
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  viewFlag(){
    this.chalService.viewFlag(this.id).subscribe(
      data => {
        this.flags[this.index] = data.msg;
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  deleteChal(){
    this.chalService.deleteChal(this.id).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        if(this.index===0)
          this.router.navigate(['/chals/add']);
        else
          this.displayChal(this.index-1);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

}
