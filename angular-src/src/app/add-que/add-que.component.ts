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
  sol=[false,false,false,false];
  type=1;
  opt=[];

  ngOnInit() {
    this.addQueForm = new FormGroup({
      'lang': new FormControl(null, [Validators.required]),
      'desc': new FormControl(null, [Validators.required]),
      'type': new FormControl(null, [Validators.required]),
      'points': new FormControl(null, [Validators.required]),
      'author': new FormControl(null, [Validators.required]),
      'opt1':new FormControl(null),
      'opt2':new FormControl(null),
      'opt3':new FormControl(null, []),
      'opt4':new FormControl(null, [])
    });
  }
  bindSol(k: number){
    this.sol[k]=!this.sol[k];
    if(this.type==1)
      for(let i=0;i<4;i++){
        if(i==k)
          continue;
      this.sol[i]=false;}
    console.log(this.sol);
  }
  bindOpt(e: any,i:number){
      this.opt[i]=e.target.value;
  }
  addQue(navigate: boolean){
    const que = {
      lang: this.addQueForm.value.lang,
      desc: this.addQueForm.value.desc,
      type: this.addQueForm.value.type,
      points: this.addQueForm.value.points,
      author: this.addQueForm.value.author,
      opt:[],
      sol:[]
    }
    que.opt=this.opt;
    
    console.log(que.opt);
    for(var i=0;i<4;i++){
      if(this.sol[i]==true){
        que.sol.push(que.opt[i]);
      }
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
