/**
 * This page displays the forecast to the user
 * 
 * @author Pawel Dworzycki
 * @version 07/12/2017
 */

// Framework Imports
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

// Models
import { WeatherResponseModel } from "../../models/weather-response-model";

// Providers
import { WeatherProvider } from '../../providers/weather/weather';
import { StateProvider } from '../../providers/state/state';
import { CurrentLocationProvider } from "../../providers/current-location/current-location";
import { GenericProvider } from "../../providers/generic/generic";
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';
import { BackgroundModeProvider } from '../../providers/background-mode/background-mode';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  page: String = "Forecast";

  constructor(
    public navCtrl: NavController,
    public stateProvider: StateProvider,
    public genericProvider: GenericProvider,
    public backgroundModeProvider: BackgroundModeProvider,
    private weatherProvider: WeatherProvider,
    private currentLocationProvider: CurrentLocationProvider,
    private errorHandlerProvider: ErrorHandlerProvider) { }

  ngOnInit() {
    this.getCurrentLocation().then(() => {
      // Call the weather API if there is no weather
      // TODO update every hour
      if (this.stateProvider.weather == undefined) {
        this.getWeather();
      }
    });
  }

  getWeather() {
    // TODO hardcoded
    let lat: String = null;
    let lng: String = null;

    // Read current location from local storage
    if (localStorage.getItem("latitude")) {
      lat = localStorage.getItem("latitude");
    }
    else {
      throw new Error("NO_COORDS");
    }
    if (localStorage.getItem("longitude")) {
      lng = localStorage.getItem("longitude");
    }
    else {
      throw new Error("NO_COORDS");
    }

    try {
      // TODO units hardcoded to si
      this.weatherProvider.getWeatherForecast(lat, lng, "si").subscribe((weather) => {
        // Save weather
        this.stateProvider.weather = new WeatherResponseModel();
        this.stateProvider.weather = (weather);
        // Convert temp from a float to an int
        this.stateProvider.weather.currently.temperature = parseInt(this.stateProvider.weather.currently.temperature.toString());
        // Convert icons' string to an icon in the assets folder
        // TODO should probably be done in the service
        this.stateProvider.weather.displayIcon = this.weatherProvider.setWeatherIcon(this.stateProvider.weather.currently.icon);
        this.stateProvider.weather.hourly.data.forEach(hour => {
          hour.temperature = parseInt(hour.temperature.toString());
          hour.displayIcon = this.weatherProvider.setWeatherIcon(hour.icon);
        });
        // Limit forecast to the next 10 hours (can show tomorrow's)
        this.stateProvider.weather.hourly.data.length = 10;
      }, error => {
        this.errorHandlerProvider.handleError(error.message, this.page, "getWeather - sub");
      });
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "getWeather");
    }
  }

  getCurrentLocation(): Promise<void> {
    return new Promise<void>(resolve => {
      this.currentLocationProvider.getCurrentLocation().then(() => {
        this.currentLocationProvider.getReadableLocation(localStorage.getItem("latitude"), localStorage.getItem("longitude")).subscribe((data) => {
          this.stateProvider.currentLocation = (data);
        }, error => {
          this.errorHandlerProvider.handleError(error.message, this.page, "getCurrentLocation");
        });
        resolve();
      })
    });
  }

}
