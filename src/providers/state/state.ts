/**
 * This provider is responsible for keeping the current state of the 
 * application.
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
 */

// Framework Imports
import { Injectable } from '@angular/core';

// Models
import { WeatherResponseModel } from "../../models/weather-response-model";
import { GoogleLocationModel } from "../../models/google-location-model";
import { SimpleLocationModel } from '../../models/simple-location-model';

@Injectable()
export class StateProvider {

  // Locations
  currentLocation: GoogleLocationModel;
  visitedLocations: SimpleLocationModel[];
  // Weather
  weather: WeatherResponseModel;

  constructor() {
    this.currentLocation = new GoogleLocationModel();
    this.visitedLocations = new Array<SimpleLocationModel>();
  }

}
