import { Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';


@Injectable()
export class FlawService {

  constructor(private http: Http){
  }

  getAllflaws(){
      const headers = new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      return this.http.get(environment.apiUrl + 'flaws', {headers: headers}).map(res => res.json());
  }

  /*submitFlag(id, flag){
      const headers = new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      return this.http.post(environment.apiUrl + 'chals/'+id, {flag: flag}, {headers: headers}).map(res => res.json());
  }*///api not ready.. submitAll()
  saveSol(id,sol){
    const headers = new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(environment.apiUrl + 'flaws/saveAns', {'flawId':id,'ans':sol}, {headers: headers}).map(res => res.json());
  
  }
  addflaw(flaw){
      const headers = new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      return this.http.post(environment.apiUrl+'flaws/add', flaw, {headers: headers}).map(res => res.json());
  }

  viewSol(id){
      const headers = new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      return this.http.get(environment.apiUrl+'flaws/viewSol/'+id, {headers: headers}).map(res => res.json());
  }

  deleteflaw(id){
      const headers = new Headers({
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      });
      return this.http.delete(environment.apiUrl+'flaws/'+id, {headers: headers}).map(res => res.json());
  }

  execute(id){
    const headers = new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post(environment.apiUrl+'flaws/execute', {headers: headers}).map(res => res.json());
  }

}
