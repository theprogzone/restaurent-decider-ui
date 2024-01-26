import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const baseUrl = 'http://localhost:8080/api/v1/';

@Injectable({
  providedIn: 'root',
})
export class RestService {

  authToken : string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  postMethod(data: any, url: string): Observable<any> {
    this.authToken = this.authService.getAuthToken();
    if (this.authToken != null) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken, // Include any other headers as needed
      });
      return this.http.post(baseUrl + url, data, { headers });
    } else {
      return this.http.post(baseUrl + url, data);
    }
  }

  putMethod(data: any, url: string): Observable<any> {
    this.authToken = this.authService.getAuthToken();
    if (this.authToken != null) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authToken, // Include any other headers as needed
      });
      return this.http.put(baseUrl + url, data, { headers });
    } else {
      return this.http.put(baseUrl + url, data);
    }
  }

  get(url: string): Observable<any> {
    this.authToken = this.authService.getAuthToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.authToken, // Include any other headers as needed
    });
    return this.http.get<any>(baseUrl + url, { headers });
  }

}
