import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { NotificationsService } from 'angular2-notifications/dist/';
import { faPlusCircle, faTrash, faPencilAlt, faEye } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';

import { AuthService } from '../services/auth.service';
import { FlawService } from '../services/flaw.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

fontawesome.library.add(faPlusCircle, faTrash, faPencilAlt, faEye);

@Component({
  selector: 'app-flaw',
  templateUrl: './flaw.component.html',
  styleUrls: ['./flaw.component.css']
})
export class FlawComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthService,
    private flawService: FlawService/*,
    private notificationsService: NotificationsService*/) { }

    flaws;
    selected: boolean = false;
    qName: string;
    points: number;
    welcome: string = "<h2>Welcome</h2><h3>to</h3><h1>Flawless</h1><br><br><p>Click on any question to begin</p>";
    author: string;
    users = [];
    user;
    id: string;
    qCode; ipFormat; opFormat; testcase; constraint; explain; timeLimit; sourceLimit; desc; others;
    solved;
    isSolved: boolean = false;
    index: number;
    flags;
  
    flagForm: FormGroup;
    addFlawForm: FormGroup;

  ngOnInit() {
    this.flawService.getAllflaws().subscribe(
      data => {
        this.user = JSON.parse(localStorage.getItem('user')).name;
        this.flaws = data.flaws;
        this.solved = new Array(this.flaws.length).fill(false);
        this.flags = new Array(this.flaws.length).fill("");
        // for(let i=0;i<this.flaws.length;i++){
        //   this.solved[i] = (this.flaws[i].users.indexOf(JSON.parse(localStorage.getItem('user')).name) > -1);
        // }
      },
      error => {
        //this.notificationsService.create("", JSON.parse(error._body).error, "");
      }
    );
    this.flagForm = new FormGroup({
      'flag': new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
    // this.addFlawForm = new FormGroup({
    //   'title': new FormControl(null, [Validators.required]),
    //   'desc': new FormControl(null, [Validators.required, Validators.minLength(10)]),
    //   'flag': new FormControl(null, [Validators.required, Validators.minLength(5)]),
    //   'points': new FormControl(null, [Validators.required]),
    //   'author': new FormControl(null, [Validators.required])
    // });
  }

  displayFlaw(index){
    this.index = index;
    this.selected = true;
    this.qName = this.flaws[index].qName;
    this.points = this.flaws[index].points;
    this.author = this.flaws[index].author;
    this.desc = this.flaws[index].desc;
    this.qCode = this.flaws[index].qCode;
    this.ipFormat = this.flaws[index].ipFormat;
    this.opFormat = this.flaws[index].opFormat;
    this.constraint = this.flaws[index].constraint;
    this.testcase = this.flaws[index].testcase;
    this.explain = this.flaws[index].explain;
    this.timeLimit = 'Time Limit: '+this.flaws[index].timeLimit/1000+' second(s)';
    this.sourceLimit = 'Source Limit: '+this.flaws[index].sourceLimit+' bytes';
    this.others = this.timeLimit+'\r\n'+this.sourceLimit;
    this.id = this.flaws[index]._id;
    this.isSolved = this.solved[index];
    // if(this.isAdmin()){
    //   if(this.flags[index]=="")
    //     this.viewFlag();
    // }
  }

  submitFlag(){
    this.flawService.saveSol(this.id, this.flagForm.value.flag).subscribe(
      data => {
        if(data.solved){
          // this.notificationsService.success("Yahoo!!", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
          this.solved[this.index] = true;
          this.isSolved = true;
          this.flagForm.reset();
        }
        else;
          // this.notificationsService.error("Sigh!!", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      },
      error => {
        // this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  addFlaw(){
    const flaw = {
      title: this.addFlawForm.value.title,
      desc: this.addFlawForm.value.desc,
      flag: this.addFlawForm.value.flag,
      points: this.addFlawForm.value.points,
      author: this.addFlawForm.value.author
    }
    this.flawService.addflaw(flaw).subscribe(
      data => {
        // this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.addFlawForm.reset();
      },
      error => {
        // this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  viewFlag(){
    this.flawService.viewSol(this.id).subscribe(
      data => {
        this.flags[this.index] = data.msg;
      },
      error => {
        // this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  deleteFlaw(){
    this.flawService.deleteflaw(this.id).subscribe(
      data => {
        // this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        if(this.index===0)
          this.router.navigate(['/flaws/add']);
        else
          this.displayFlaw(this.index-1);
      },
      error => {
        // this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  isAdmin(){
    return this.authService.isAdmin();
  }

}
