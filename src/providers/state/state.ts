/**
 * This provider is responsible for keeping the current state of the 
 * application.
 * 
 * @author Pawel Dworzycki
 * @version 04/02/2018
 */

// Framework Imports
import { Injectable } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// Providers
import { ErrorHandlerProvider } from "../../providers/error-handler/error-handler";

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

  constructor(private androidPermissions: AndroidPermissions, private errorHandlerProvider: ErrorHandlerProvider) {
    this.currentLocation = new GoogleLocationModel();
    this.visitedLocations = new Array<SimpleLocationModel>();
  }

  hasLocationPermission(): boolean {
    let rtnBool = false;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => rtnBool = result,
      err => this.errorHandlerProvider.handleError("PERMISSION_MISSING", "APP", "checkIfHasPermission")
    );
    return rtnBool;
  }

  requestLocationPermission() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
  }

}
