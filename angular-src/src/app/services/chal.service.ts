import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map'

import { environment } from '../../environments/environment';

@Injectable()
export class ChalService{

    constructor(private http: Http){
    }

    getAllChals(){
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.get(environment.apiUrl + 'chals', {headers: headers}).map(res => res.json());
    }

    submitFlag(id, flag){
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.post(environment.apiUrl + 'chals/'+id, {flag: flag}, {headers: headers}).map(res => res.json());
    }

    addChal(chal){
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.post(environment.apiUrl+'chals/add', chal, {headers: headers}).map(res => res.json());
    }

    viewFlag(id){
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.get(environment.apiUrl+'chals/'+id+'/flag', {headers: headers}).map(res => res.json());
    }

    deleteChal(id){
        const headers = new Headers({
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        });
        return this.http.delete(environment.apiUrl+'chals/'+id, {headers: headers}).map(res => res.json());
    }
}