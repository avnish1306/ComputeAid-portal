import { Component, OnInit } from '@angular/core';
import { ChalService } from '../services/chal.service';
import { NotificationsService } from 'angular2-notifications/dist/';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  constructor(private chalService: ChalService,
    private notificationsService: NotificationsService) { }

  chals: any;
  ranking = {};
  scores = [];
  team = JSON.parse(localStorage.getItem('user')).name;

  ngOnInit() {
    this.chalService.getAllChals().subscribe(
      data =>{
        this.chals = data.chals;
        for(let chal of this.chals){
          for(let user of chal.users){
            if(this.ranking.hasOwnProperty(user))
              this.ranking[user] = this.ranking[user]+chal.points;
            else
              this.ranking[user] = chal.points;
          }
        }
        for(let key in this.ranking){
          if(this.ranking.hasOwnProperty(key)){
            this.scores.push({'team': key, 'score': this.ranking[key]})
          }
        }
        this.scores.sort(function(a, b){
          return b.score - a.score;
        });
      },
      error => {
        this.notificationsService.error("Oops!!", JSON.parse(error._body).error, {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      }
    );
  }

}
