/**
 * This provider is responsible for allowing the app to run
 * whilst in the background
 * 
 * @author Pawel Dworzycki
 * @version 04/03/2018
 */

// Framework imports
import { Injectable } from '@angular/core';
import { BackgroundMode } from '@ionic-native/background-mode';
import { CurrentLocationProvider } from '../current-location/current-location';

@Injectable()
export class BackgroundModeProvider {

  constructor(private backgroundMode: BackgroundMode, private currentLocationProvider: CurrentLocationProvider) {}

  enableBackgroundMode() {
    this.backgroundMode.enable();
    this.optimisations();
  }

  moveAppToBackground() {
    // On Android have to move the app to the background with this method inorder to 
    // track GPS location 
    this.backgroundMode.moveToBackground();
  }

  private optimisations() {
    // Override the back button on Android to go to background instead of closing the app.
    //this.backgroundMode.overrideBackButton();

    // Various APIs like playing media or tracking GPS position in background might not work 
    // while in background even the background mode is active. To fix such issues the plugin 
    // provides a method to disable most optimizations done by Android/CrossWalk.
    this.backgroundMode.disableWebViewOptimizations();
  }

}
