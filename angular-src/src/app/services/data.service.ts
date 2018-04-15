import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class DataService {

  private name = new BehaviorSubject<string>("");;
  currentName = this.name.asObservable();

  constructor() { 
    if(localStorage.getItem('user'))
      this.name.next(JSON.parse(localStorage.getItem('user')).name);
  }

  changeName(name: string) {
    this.name.next(name)
  }

}