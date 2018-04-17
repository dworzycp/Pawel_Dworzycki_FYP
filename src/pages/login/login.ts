/**
 * This page is responsible for allowing the user to log in to the applications
 * Currently only Google Authentication is supported
 * 
 * @author Pawel Dworzycki
 * @version 16/03/2018
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
import { AzureProvider } from "../../providers/azure/azure";
import { ErrorHandlerProvider } from "../../providers/error-handler/error-handler";
import { StateProvider } from "../../providers/state/state";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  page: String = "Login";

  // View
  public showLoginButton: boolean;
  public showDebug: boolean;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private googlePlus: GooglePlus,
    private menu: MenuController,
    private authenticationProvider: AuthenticationProvider,
    private backgroundModeProvider: BackgroundModeProvider,
    private azureProvider: AzureProvider,
    private errorHandlerProvider: ErrorHandlerProvider,
    public stateProvider: StateProvider) {
    // Disable side menu
    this.menu.swipeEnable(false);
    this.showLoginButton = false;
    this.showDebug = false;

    platform.ready().then(() => {
      // Check if the user is already signed in
      this.googlePlus.trySilentLogin({})
        .then(res => this.LoginSuccess(res))
        .catch(res => this.silentFailed());
    });
  }

  public login() {
    this.googlePlus.login({})
      .then(res => this.LoginSuccessNotSilent(res))
      .catch(err => this.errorHandlerProvider.handleError(err, this.page, "login"));
  }

  private LoginSuccessNotSilent(res) {
    // Now call LoginSuccess(res)
    this.LoginSuccess(res);
    // Check if the user is new
    // TODO will this work when LoginSuccess redirects to home page?
    this.azureProvider.isNewUser();
  }

  private LoginSuccess(res) {
    // Set user object
    this.authenticationProvider.setUserObject(res);
    // Hide log in button
    this.showLoginButton = false;
    // TODO for now the app will only collect data i.e. no functionality will be available to the user
    // TODO Redirect the user to the home page
    this.navCtrl.setRoot(HomePage);
  }

  private silentFailed() {
    this.showLoginButton = true;
  }

  public toggleDebugMode() {
    this.showDebug = !this.showDebug;
  }

  // TODO check that the user is allowed to leave this page, i.e. is logged in
  //      more important on other pages than this CanEnter...
  // ionViewCanLeave(): boolean {
  //   if () {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }

}
