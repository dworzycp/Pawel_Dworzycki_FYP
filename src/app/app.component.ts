/**
 * Main app component
 * 
 * @author Pawel Dworzycki
 * @version 16/04/2018
 */
// Framework Imports
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// Providers
import { BackgroundModeProvider } from '../providers/background-mode/background-mode';
import { AuthenticationProvider } from "../providers/authentication/authentication";

// Pages
import { HomePage } from '../pages/home/home';
import { MapPage } from "../pages/map/map";
import { LoginPage } from '../pages/login/login';
import { JourneysPage } from '../pages/journeys/journeys';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private backgroundModeProvider: BackgroundModeProvider,
    public authenticationProvider: AuthenticationProvider,
    private googlePlus: GooglePlus,
    private androidPermissions: AndroidPermissions) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Forecast', component: HomePage, icon: "sunny" },
      { title: 'Journeys', component: JourneysPage, icon: "compass" },
      { title: 'Map', component: MapPage, icon: "pin" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // Ask the user for required permissions
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.googlePlus.logout()
      // Logged in
      .then(res => this.logOutSuccess())
      // Error
      .catch(err => alert(err));
  }

  private logOutSuccess() {
    // Clear user object
    this.authenticationProvider.clearUserObject();
    // Redirect the user back to the login page
    this.nav.setRoot(LoginPage);
  }

}
