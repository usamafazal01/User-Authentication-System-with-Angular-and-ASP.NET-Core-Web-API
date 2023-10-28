// session-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth-service.service'; // Your service for handling authentication and token storage

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isTokenValid()) {
      console.log('SessionGuard: Token is valid. Allowing access.');
      return true;
    } else {
      console.log('SessionGuard: Token is not valid. Redirecting to login.');
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
