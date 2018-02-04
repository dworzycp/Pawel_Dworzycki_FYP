/**
 * This page is responsible for allowing the user to log in to the applications
 * Currently only Google Authentication is supported
 * 
 * @author Pawel Dworzycki
 * @version 02/02/2018
 */
// Framework imports
import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, MenuController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';

// Pages
import { HomePage } from "../home/home";

// Providers
import { AuthenticationProvider } from "../../providers/authentication/authentication";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(
    public navCtrl: NavController, 
    private platform: Platform, 
    private googlePlus: GooglePlus, 
    private menu: MenuController,
    private authenticationProvider: AuthenticationProvider) {
    // Disable side menu
    this.menu.swipeEnable(false);

    platform.ready().then(() => {
      // Check if the user is already signed in
      this.googlePlus.trySilentLogin({})
      // Logged in
      // TODO redirect the user
      .then(res => this.LoginSuccess(res))
      // Error - do nothing
      .catch();
    });
  }

  public login() {
    // TODO probably move this to authentication service
    this.googlePlus.login({})
      // Logged in
      // TODO redirect the user
      .then(res => this.LoginSuccess(res))
      // Error
      // TODO error handling
      .catch(err => alert(err));
  }

  private LoginSuccess(res) {
    // Set user object
    this.authenticationProvider.setUserObject(res);
    // Redirect the user to the home page
    this.navCtrl.setRoot(HomePage);
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
