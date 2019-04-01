import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications/dist/';
import { faPlusCircle, faTrash, faPencilAlt, faEye } from '@fortawesome/fontawesome-free-solid'
import fontawesome from '@fortawesome/fontawesome';

import { AuthService } from '../services/auth.service';
import { QuesService } from '../services/ques.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

fontawesome.library.add(faPlusCircle, faTrash, faPencilAlt, faEye);

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  constructor(private router: Router,
  private authService: AuthService,
  private quesService: QuesService,
  private notificationsService: NotificationsService) { }

  ques;
  i;
  selected: boolean = false;
  type: number;
  points: number;
  desc: string = "<h2>Welcome</h2><h3>to</h3><h1>Bughunt</h1><br><br><p>Click on any question to begin</p>";
  author: string;
  users = [];
  id: string;
  saved;
  isSaved: boolean = false;
  index: number;
  opt;
  sol;
  isEligible=false;
  isAttempt=false;
  submission;
  submitted=[false,false,false,false];
  selectedOpt=[false,false,false,false];

  optForm: FormGroup;
  addQueForm: FormGroup;

  
  ngOnInit() {
    
    this.quesService.getAllQues().subscribe(
      data => {
        this.ques = data.ques;
        this.submission=data.submission;
        this.isEligible=data.isEligible;
        this.isAttempt=data.isAttempt;
        this.saved = new Array(this.ques.length);
        this.sol = new Array(this.ques.length).fill([]);
        for(let i=0;i<this.ques.length;i++){
          var sol;//=this.submission.find(que=>{ console.log(que.queId,"   ",this.ques[i]._id); if(que.queId==this.ques[i]._id) return que.sol});
          for(var j=0;j<this.submission.length;j++){
            console.log(this.submission[j].queId,"  ",this.ques[i]._id);
            if(this.submission[j].queId==this.ques[i]._id) {
                sol=this.submission[j].ans;
                this.saved[i]=true;
                this.sol[i]=this.submission[j].ans;
                break;
            }
            
          }
          if(!this.saved[i]){
            this.saved[i]=false;
            this.sol[i]=[];
          }
          console.log(sol);
          /*if(sol.length>0&&this.submission.length&&this.submission.length>0)
           {this.saved[i] = true
            this.sol[i] = sol
              } //(this.chals[i].users.indexOf(JSON.parse(localStorage.getItem('user')).name) > -1);
          else{this.saved[i] = false
            this.sol[i] = []
          }*/
              console.log(this.saved); 

        }
      },
      error => {
        this.notificationsService.create("", JSON.parse(error._body).error, "");
      }
    );
    this.optForm = new FormGroup({
      'opt': new FormControl(null, [Validators.required, Validators.required])
    });
    this.addQueForm = new FormGroup({
      'lang': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required, Validators.minLength(10)]),
      'opt': new FormControl(null, [Validators.required, Validators.required]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required]),

    });
  }
  bindSol(i){
    this.selectedOpt[i]=!this.selectedOpt[i];
  }
  bindSolR(i){
    this.selectedOpt[i]=!this.selectedOpt[i];
    for(var j=0;j<4;j++){
      if(i!=j&&this.selectedOpt[j]==true){
        this.selectedOpt[j]=false;
      }
      
    }
    
  }
  displayQue(index){
    
    this.i=0;
    this.submitted=[false,false,false,false];
    this.index = index;
    this.selected = true;
    this.points = this.ques[index].points;
    this.author = this.ques[index].author;
    this.desc = this.ques[index].desc;
    this.id = this.ques[index]._id;
    this.isSaved = (this.sol[index].length>0)?true:false;
    this.type=this.ques[index].type;
    this.opt=this.ques[index].opt;
    var sol=this.submission.find(que=>{ console.log(que.queId,"  ||  ", this.id); if(que.queId==this.id) return que;});
    if(!this.isSaved){
      this.optForm.reset();
    }
    
    console.log("  sol ",sol);
   
    if(sol){
      sol=sol.ans;
    for(var i=0;i< sol.length;i++){
        for(var j=0;j<4;j++){
          if(sol[i]==this.opt[j]){
            this.submitted[j]=true;
            break;
          }
        }
    }}
    this.selectedOpt=this.submitted;
    

    if(this.isAdmin()){
      if(this.sol[index].length===0)
        this.viewSol();
    }
  }

  saveSol(que){
    console.log(" saveSol   ",this.optForm.value.opt);
    var sol=[];
    if(que.type==1)
      sol.push(this.optForm.value.opt);
    else if(que.type==2){
      for(var i=0;i<4;i++){
        if(this.selectedOpt[i]){
          sol.push(que.opt[i]);
        }
      }
    }
    this.quesService.saveSol(this.id, sol).subscribe(
      data => {
        if(data.saved){
          this.notificationsService.success("", data.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
          this.sol[this.index] = this.optForm.value.opt;
          this.saved[this.index]=true;
          this.isSaved = true;
        }
        else
          this.notificationsService.error("", data.msg, {timeOut: 2000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  addQue(){
    const que = {
      lang: this.addQueForm.value.lang,
      desc: this.addQueForm.value.desc,
      opt: this.addQueForm.value.opt,
      optCheck:this.addQueForm.value.optCheck,
      points: this.addQueForm.value.points,
      author: this.addQueForm.value.author,
      sol:[],
      type:1
    }
    for(var i=0;i<que.opt.length;i++){
      if(que.optCheck[i]==1){
        que.sol.push(que.opt[i]);
      }
    }
    if(que.sol.length>1){
      que.type=2;
    }
    this.quesService.addQue(que).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.addQueForm.reset();
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  viewSol(){
    this.quesService.viewSol(this.id).subscribe(
      data => {
        this.sol[this.index] = data.sol;
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

  deleteQue(){
    this.quesService.deleteQue(this.id).subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        if(this.index===0)
          this.router.navigate(['/ques/add']);
        else
          this.displayQue(this.index-1);
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }
  submitSol(){
    this.quesService.submitSol().subscribe(
      data => {
        this.notificationsService.success("Success", data.msg, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
        this.ngOnInit();
        this.router.navigate(['/']);
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
