// session.service.ts
import { Injectable } from '@angular/core';

import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { interval, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private sessionCheckInterval = 120000; // 2 minutes in milliseconds (adjust to match your server's session timeout)
  private sessionCheckTimer: Subscription | undefined;
  private sessionExpiredAlertShown = false; // Flag to track if the alert has been shown

  constructor(private http: HttpClient, private router: Router) {}

  startSessionCheck() {
    this.sessionCheckTimer = interval(this.sessionCheckInterval).pipe(
      tap(() => {
        if (!this.sessionExpiredAlertShown) {
          this.checkSessionStatus()
            .pipe(
              catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                  this.handleSessionExpired();
                }
                // Handle other error types if needed.
                return [];
              })
            )
            .subscribe(() => {
              // Session is still valid.
            });
        }
      })
    ).subscribe();
  }

  checkSessionStatus() {
    // Make an API request to check the session status on the server.
    // You can return an Observable that verifies session status from the server.
    return this.http.get('https://localhost:7207/api/User/checkSessionStatus');
  }

  handleSessionExpired() {
    // Display an alert when the session expires, but only if it hasn't been shown before.
    if (!this.sessionExpiredAlertShown) {
      this.sessionExpiredAlertShown = true; // Set the flag to indicate the alert has been shown.
      alert('Session has expired. Please log in again.');

      // Redirect to the login page or perform any other necessary actions.
      // Example: You can navigate to the login page using Angular's Router.
      this.router.navigate(['/login']);
    }
  }

  stopSessionCheck() {
    if (this.sessionCheckTimer) {
      this.sessionCheckTimer.unsubscribe();
    }
  }
}
