import { Component, OnInit, NgZone } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Restaurant } from '../models/restaurant.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  sessionId = '';
  link = '';
  personName = '';
  restaurantName = '';
  restaurantLocation = '';
  isTerminated = false;
  isChoiceSubmitted = false;
  choices: Restaurant[] = [];
  intervalId: any;
  selectedRestaurant: string | null = null;
  selectedRestaurantLocation = '';

  constructor(private restService: RestService, private authService: AuthService, private ngZone: NgZone, private router: Router) {}

  ngOnInit(): void {
    this.getLoginDet();
    if (this.authService.getAuthToken() == null) {
      this.redirectToAnotherComponent();
    }
    if (this.sessionId != '') {
      this.getRestaurantChoices();
    }
    
    if (this.isChoiceSubmitted) {
      this.startAsyncMethod();
    }
    
  }

  startSession(): void {
    const data = {
      type: 'start'
    };

    this.restService.postMethod(data, 'session').subscribe({
      next: (res) => {
        this.link = 'http://localhost:4200/choices?sessionId=' + res.sessionId;
        this.sessionId = res.sessionId;
      },
      error: (e) => console.error(e)
    });
  }

  terminateSession(): void {
    const data = {
      type: 'stop',
      sessionId: this.sessionId
    };

    this.restService.postMethod(data, 'session').subscribe({
      next: (res) => {
        this.isTerminated = true;
      },
      error: (e) => console.error(e)
    });
  }

  submitRestaurantChoice(): void {
    const data = {
      sessionId: this.sessionId,
      restaurantName: this.restaurantName,
      restaurantLocation: this.restaurantLocation,
      personName: this.personName
    };

    this.restService.postMethod(data, 'restaurant').subscribe({
      next: (res) => {
        this.isChoiceSubmitted = true;
        this.startAsyncMethod();
      },
      error: (e) => console.error(e)
    });
  }

  getRestaurantChoices(): void {
    this.restService.get('restaurant?sessionId=' + this.sessionId)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.choices = res.restaurantList;
        this.selectedRestaurant = res.selectedRestaurant.restaurantName;
        this.selectedRestaurantLocation = res.selectedRestaurant.restaurantLocation;
      },
      error: (e) => console.error(e)
    });
  }

  getLoginDet(): void {
    //this.authService.setAuthToken(null);
    this.restService.get('login')
    .subscribe({
      next: (res) => {
        
      },
      error: (e) => {
        this.authService.setAuthToken(null);
      }
    });
  }

  startAsyncMethod(): void {
    this.intervalId = setInterval(() => {
      this.ngZone.run(() => {
        this.choices = [];
        this.getRestaurantChoices();
      });
    }, 2000); // 10000 milliseconds = 10 seconds
  }

  stopAsyncMethod(): void {
    clearInterval(this.intervalId);
  }

  redirectToAnotherComponent() {
    this.router.navigate(['/login']);
  }
}
