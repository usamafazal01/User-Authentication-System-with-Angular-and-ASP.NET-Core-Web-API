import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt'; // Import the JWT library
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "https://localhost:7207/api/User/";
  private jwtHelper: JwtHelperService = new JwtHelperService(); // Create an instance of JwtHelperService

  constructor(private http: HttpClient) { }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token); // Store the token in local storage
      })
    );
  }
  

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
  
    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        console.log('Token is expired.'); // Log token expiration
        return false;
      } else {
        console.log('Token is valid.'); // Log valid token
        return true;
      }
    }
  
    console.log('No token found in local storage.'); // Log if no token is found
    return false;
  }
  
}
