import { Component, NgZone } from '@angular/core';
import { Restaurant } from '../models/restaurant.model';
import { RestService } from '../services/rest.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-choice',
  templateUrl: './choice.component.html',
  styleUrl: './choice.component.css'
})
export class ChoiceComponent {
  sessionId: string | null = '';
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

  constructor(private restService: RestService, private authService: AuthService, private ngZone: NgZone, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe((params) => {
        this.sessionId = params.get('sessionId');
      }
    );
    if (this.sessionId != '') {
      this.getRestaurantChoices();
    }
    
    if (this.isChoiceSubmitted) {
      this.startAsyncMethod();
    }
    
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
        this.choices = res.restaurantList;
        this.selectedRestaurant = res.selectedRestaurant.restaurantName;
        this.selectedRestaurantLocation = res.selectedRestaurant.restaurantLocation;
      },
      error: (e) => console.error(e)
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
}
