import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'Angular 17 Crud example';
  isAuthenticated = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Your method call goes here
    
    if (this.authService.getAuthToken() != null) {
      console.log('here');
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }
}
