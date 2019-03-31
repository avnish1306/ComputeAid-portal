import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from 'angular2-notifications/dist/';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private notificationsService: NotificationsService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.isAdmin()){
      this.router.navigate(['/login']);
      this.notificationsService.warn("Booo...", "You are not authorized to view this page!!", {timeOut: 5000, showProgressBar: true, pauseOnHover: true, clickToClose: true, animate: 'fromRight'});
      return false;
    }
    return true;
  }
}
