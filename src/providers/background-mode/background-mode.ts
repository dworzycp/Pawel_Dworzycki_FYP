/**
 * This provider is responsible for tracking GPS data in the background
 * 
 * @author Pawel Dworzycki
 * @version 16/03/2018
 */

// Framework imports
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

// Models
import { SimpleLocationModel } from '../../models/simple-location-model';

// Providers
import { CurrentLocationProvider } from "../current-location/current-location";
import { ErrorHandlerProvider } from "../error-handler/error-handler";

import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class BackgroundModeProvider {

  constructor(
    public platform: Platform,
    private currentLocationProvider: CurrentLocationProvider,
    private errorHandlerProvider: ErrorHandlerProvider) {
    platform.ready().then(
      this.configureBackgroundGeolocation.bind(this)
    );
  }

  // BASED ON https://github.com/pmwisdom/cordova-background-geolocation-services
  configureBackgroundGeolocation() {
    // Get a reference to the plugin
    var bgLocationServices = (<any>window).plugins.backgroundLocationServices;

    // Congfigure Plugin
    bgLocationServices.configure({
      //Both
      desiredAccuracy: 20, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
      distanceFilter: 0, // (Meters) How far you must move from the last point to trigger a location update
      debug: false, // <-- Enable to show visual indications when you receive a background location update
      interval: 1200000, // (Milliseconds) Requested Interval in between location updates.
      useActivityDetection: false, // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)

      //Android Only
      notificationTitle: 'Collecting GPS data', // customize the title of the notification
      notificationText: 'Please do not turn this app off', //customize the text of the notification
      fastestInterval: 5000 // <-- (Milliseconds) Fastest interval your app / server can handle updates
    });

    //Register a callback for location updates, this is where location objects will be sent in the background
    bgLocationServices.registerForLocationUpdates(location => {
      // Create a model
      let loc = new SimpleLocationModel();
      loc.lat = location.latitude;
      loc.lng = location.longitude;
      loc.createdAt = new Date();
      loc.sentToAzure = false;

      // Send model
      this.currentLocationProvider.addVisitedLocation(loc);
    }, error => {
      this.errorHandlerProvider.handleError(error, "background-mode", "configureBackgroundGeolocation");
    });

    //Start the Background Tracker. When you enter the background tracking will start, and stop when you enter the foreground.
    bgLocationServices.start();
  }

}
