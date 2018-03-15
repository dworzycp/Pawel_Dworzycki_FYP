/**
 * This provider tracks the location of the user based on GPS hardware in the device.
 * It also calls Google API to get an address for lat and lon co-ordinates.
 * 
 * @author Pawel Dworzycki
 * @version 15/03/2018
 */

// Framework
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'Rxjs/rx';
import { Subscription } from "rxjs/Subscription";

// Models
import { GoogleLocationModel } from "../../models/google-location-model";
import { SimpleLocationModel } from '../../models/simple-location-model';

// Providers
import { ConstantsProvider } from "../constants/constants";
import { StateProvider } from "../state/state";
import { ErrorHandlerProvider } from '../error-handler/error-handler';
import { AzureProvider } from "../azure/azure";
import { GenericProvider } from "../generic/generic";
import { AuthenticationProvider } from '../authentication/authentication';
import { DateTime } from 'ionic-angular';

@Injectable()
export class CurrentLocationProvider {

  page: String = "CurrentLocationProvider";
  private dateLastGPSCoordsWereSent: Date;

  constructor(
    public http: HttpClient,
    private constantsProvider: ConstantsProvider,
    private geolocation: Geolocation,
    private stateProvider: StateProvider,
    private errorHandlerProvider: ErrorHandlerProvider,
    private azureProvider: AzureProvider,
    private genericProvider: GenericProvider,
    private authenticationProvider: AuthenticationProvider) { }

  // TODO this is bad. Check for permission when calling a method rather than depend on a method being
  // called from here
  public checkIfHasPermission() {
    if (this.stateProvider.hasLocationPermission) {
      this.watchLocation();
    }
    else {
      // Request the permission
      this.stateProvider.requestLocationPermission();
      // Check if the user has given permission
      this.checkIfHasPermission();
    }
  }

  getCurrentLocation(): Promise<any> {
    return new Promise<any>(resolve => {
      var onSuccess = function (position) {
        // TODO find a better solution
        // For now the lat and long coords are saved in local storage rather than returned due to scope issues
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

  // TODO singleton - this method should never be called more than once
  watchLocation() {
    // TODO check for premission here rather than before calling this
    this.geolocation.watchPosition()
      .subscribe(position => {
        if (position.coords !== undefined) {
          let loc = new SimpleLocationModel();
          loc.lat = position.coords.latitude;
          loc.lng = position.coords.longitude;
          loc.createdAt = new Date();
          loc.sentToAzure = false;

          if (this.canSendToAzure())
            this.stateProvider.addGpsStatus("Found co-ords " + loc.lat + ", " + loc.lng);

          this.addVisitedLocation(loc);
        }
        else {
          this.stateProvider.addGpsStatus("Failed to watch position");
          this.errorHandlerProvider.handleError("position.coords is undefined", this.page, "watchLocation");
        }
      });
  }

  getReadableLocation(lat: string, long: string): Observable<GoogleLocationModel> {
    return this.http.get<GoogleLocationModel>(`${this.constantsProvider.googleApiUrl}geocode/json?latlng=${lat},${long}&key=${this.constantsProvider.googleApiKey}`);
  }

  public addVisitedLocation(loc: SimpleLocationModel) {
    if (this.authenticationProvider.userId == null) throw new Error("USER_NOT_LOGGED_IN");

    try {
      if (this.canSendToAzure()) {
        //alert("canSendToAzure");
        //this.stateProvider.addGpsStatus("Added " + loc.lat + ", " + loc.lng + " as a visited location");
        this.sendLocations(loc);
      } else {
        // Only have this notice once
        if (this.stateProvider.gpsStatus[this.stateProvider.gpsStatus.length - 1] != "Waiting for " + this.constantsProvider.howOftenToRecordGPSCoordsMin + " mins")
          this.stateProvider.addGpsStatus("Waiting for " + this.constantsProvider.howOftenToRecordGPSCoordsMin + " mins");
      }
    } catch (error) {
      this.stateProvider.addGpsStatus("Failed to add " + loc.lat + ", " + loc.lng + " as a visited location");
      this.errorHandlerProvider.handleError(error.message, this.page, "addVisitedLocation");
    }
  }

  private sendLocations(loc: SimpleLocationModel) {
    try {
      // Save internally
      this.stateProvider.visitedLocations.push(loc);
      this.stateProvider.unsentCoords.push(loc);
      //this.stateProvider.addGpsStatus("Saved " + loc.lat + ", " + loc.lng + " internally");
      // Push to azure
      this.azureProvider.sendGPSCoordinates();
      // Set date location was updated
      this.dateLastGPSCoordsWereSent = new Date();
    } catch (error) {
      this.stateProvider.addGpsStatus("Failed to send " + loc.lat + ", " + loc.lng);
      this.errorHandlerProvider.handleError(error.message, this.page, "sendLocations");
    }
  }

  private canSendToAzure(): boolean {
    let rtnBool = false;

    if (this.dateLastGPSCoordsWereSent == null) {
      rtnBool = true;
    }
    else {
      let minsSinceLastUpdate = this.genericProvider.howLongSinceDate(this.dateLastGPSCoordsWereSent)[1];
      if (minsSinceLastUpdate >= this.constantsProvider.howOftenToRecordGPSCoordsMin)
        rtnBool = true;
    }

    return rtnBool;
  }

}
