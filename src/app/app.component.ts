// Framework Imports
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Providers
import { BackgroundModeProvider } from '../providers/background-mode/background-mode';

// Pages
import { HomePage } from '../pages/home/home';
import { MapPage } from "../pages/map/map";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private backgroundModeProvider: BackgroundModeProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Forecast', component: HomePage, icon: "sunny" },
      { title: 'Map', component: MapPage, icon: "pin" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Enable background mode
      this.backgroundModeProvider.enableBackgroundMode();
      // For Android (not sure about iOS) to record GPS data it needs to be pushed
      // to the background before any GPS co-ords are recorded in the foreground
      // TODO check if this is to do how watchPosition is called
      this.backgroundModeProvider.moveAppToBackground();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
