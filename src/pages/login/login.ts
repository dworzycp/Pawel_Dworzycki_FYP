/**
 * This page is responsible for allowing the user to log in to the applications
 * Currently only Google Authentication is supported
 * 
 * @author Pawel Dworzycki
 * @version 04/03/2018
 */
// Framework imports
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, MenuController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

// Pages
import { HomePage } from "../home/home";

// Providers
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { BackgroundModeProvider } from "../../providers/background-mode/background-mode";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // View
  public showLoginButton: boolean;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private menu: MenuController,
    private authenticationProvider: AuthenticationProvider,
    private backgroundModeProvider: BackgroundModeProvider) {
    // Disable side menu
    this.menu.swipeEnable(false);
    this.showLoginButton = false;

    platform.ready().then(() => {
      // Check if the user is already signed in
      this.googlePlus.trySilentLogin({})
        // Logged in
        .then(res => this.LoginSuccess(res))
        // Error - do nothing
        .catch(res => this.silentFailed());
    });
  }

  public login() {
    // TODO probably move this to authentication service
    this.googlePlus.login({})
      // Logged in
      .then(res => this.LoginSuccess(res))
      // Error
      // TODO error handling
      .catch(err => alert(err));
  }

  private LoginSuccess(res) {
    // Set user object
    this.authenticationProvider.setUserObject(res);
    // Hide log in button
    this.showLoginButton = false;
    // TODO for now the app will only collect data i.e. no functionality will be available to the user
    //      i.e. move the app straight to the bg
    this.backgroundModeProvider.moveAppToBackground();
    // TODO Redirect the user to the home page
    //this.navCtrl.setRoot(HomePage);
  }

  private silentFailed() {
    this.showLoginButton = true;
  }

  // TODO check that the user is allowed to leave this page, i.e. is logged in
  // ionViewCanLeave(): boolean {
  //   if () {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

}
