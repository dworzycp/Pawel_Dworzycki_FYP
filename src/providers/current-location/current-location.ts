/**
 * This provider tracks the location of the user based on GPS hardware in the device.
 * It also calls Google API to get an address for lat and lon co-ordinates.
 * 
 * @author Pawel Dworzycki
 * @version 07/12/2017
 */

// Framework
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
//import { Observable } from 'rxjs/Observable';
// TODO needed?
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

// Models
import { GoogleLocationModel } from "../../models/google-location-model";
import { SimpleLocationModel } from '../../models/simple-location-model';

// Providers
import { ConstantsProvider } from "../constants/constants";
import { StateProvider } from "../state/state";
import { ErrorHandlerProvider } from '../error-handler/error-handler';

@Injectable()
export class CurrentLocationProvider {

  page: String = "CurrentLocationProvider";

  constructor(
    public http: HttpClient,
    private constantsProvider: ConstantsProvider,
    private geolocation: Geolocation,
    private stateProvider: StateProvider,
    private errorHandlerProvider: ErrorHandlerProvider) {
    try {
      this.watchLocation();
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "constructor");
    }
  }

  getCurrentLocation(): Promise<any> {
    return new Promise<any>(resolve => {
      var onSuccess = function (position) {
        // TODO find a better solution
        // For now the lat and long coords are saved in local storage rather than
        // returned due to scope issues
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);

        resolve();
      };

      // onError Callback receives a PositionError object
      function onError(error) {
        alert(error);
        resolve();
      }

      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    });
  }

  watchLocation() {
    this.geolocation.watchPosition()
      .subscribe(position => {
        if (position.coords !== undefined) {
          let loc = new SimpleLocationModel();
          loc.lat = position.coords.latitude;
          loc.lng = position.coords.longitude;
          // TODO this array needs to also sync with azure
          this.addVisitedLocation(loc);
        }
      });
  }

  getReadableLocation(lat: string, long: string): Observable<GoogleLocationModel> {
    return this.http.get<GoogleLocationModel>(`${this.constantsProvider.googleApiUrl}geocode/json?latlng=${lat},${long}&key=${this.constantsProvider.googleApiKey}`);
  }

  addVisitedLocation(loc: SimpleLocationModel) {
    // TODO push to azure
    this.stateProvider.visitedLocations.push(loc);
  }

}
