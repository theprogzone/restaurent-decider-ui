import { Component } from '@angular/core';
import { Login } from '../../models/login.model';
import { RestService } from '../../services/rest.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login: Login = {
    username: '',
    userPwd: ''
  };
  submitted = false;

  constructor(private restService: RestService, private authService: AuthService, private router: Router) {}

  loginToSystem(): void {
    const data = {
      username: this.login.username,
      password: this.login.userPwd
    };

    this.restService.postMethod(data, 'login').subscribe({
      next: (res) => {
        this.authService.setAuthToken(res.token);
        this.submitted = true;
        this.redirectToAnotherComponent();
      },
      error: (e) => console.error(e)
    });
  }

  redirectToAnotherComponent() {
    this.router.navigate(['/home']);
  }
}
