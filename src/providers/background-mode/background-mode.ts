/**
 * This provider is responsible for allowing the app to run
 * whilst in the background
 * 
 * @author Pawel Dworzycki
 * @version 15/03/2018
 */

// Framework imports
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';

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
    private backgroundMode: BackgroundMode,
    private currentLocationProvider: CurrentLocationProvider,
    private errorHandlerProvider: ErrorHandlerProvider) {
    platform.ready().then(
      this.configureBackgroundGeolocation.bind(this)
    );
  }

  enableBackgroundMode() {
    //this.backgroundMode.enable();
    //this.optimisations();
    // Call watchPosition
    //this.currentLocationProvider.checkIfHasPermission();
  }

  moveAppToBackground() {
    // On Android have to move the app to the background with this method inorder to 
    // track GPS location 
    this.backgroundMode.moveToBackground();
  }

  private optimisations() {
    // Change notification title, message etc
    this.backgroundMode.setDefaults({
      title: "Collecting GPS data",
      text: "Please do not turn this app off"
    });

    // Override the back button on Android to go to background instead of closing the app.
    this.backgroundMode.overrideBackButton();

    // Various APIs like playing media or tracking GPS position in background might not work 
    // while in background even the background mode is active. To fix such issues the plugin 
    // provides a method to disable most optimizations done by Android/CrossWalk.
    this.backgroundMode.disableWebViewOptimizations();
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
      debug: true, // <-- Enable to show visual indications when you receive a background location update
      interval: 1200000, // (Milliseconds) Requested Interval in between location updates.
      useActivityDetection: false, // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)

      //Android Only
      notificationTitle: 'BG Plugin', // customize the title of the notification
      notificationText: 'Tracking', //customize the text of the notification
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
