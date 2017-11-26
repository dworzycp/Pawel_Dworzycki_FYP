/**
 * This page displays the forecast to the user
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
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

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public stateProvider: StateProvider,
    public genericProvider: GenericProvider,
    private weatherProvider: WeatherProvider,
    private currentLocationProvider: CurrentLocationProvider) { }

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
    let lat: String = "52.488255";
    let long: String = "-1.892106";

    // Read current location from local storage
    if (localStorage.getItem("latitude")) {
      lat = localStorage.getItem("latitude");
    }
    if (localStorage.getItem("longitude")) {
      long = localStorage.getItem("longitude");
    }

    if (lat && long) {
      // TODO units hardcoded to si
      this.weatherProvider.getWeatherForecast(lat, long, "si").subscribe((weather) => {
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
        alert("home :: getWeather - sub :: " + error);
      });
    }
    else {
      // TODO error handling
      alert("home :: getWeather :: no valid co-ords to call weather api");
    }
  }

  getCurrentLocation(): Promise<void> {
    return new Promise<void>(resolve => {
      this.currentLocationProvider.getCurrentLocation().then(() => {
        this.currentLocationProvider.getReadableLocation(localStorage.getItem("latitude"), localStorage.getItem("longitude")).subscribe((data) => {
          this.stateProvider.currentLocation = (data);
        }, error => {
          alert("home :: getCurrentLocation :: " + error.toString());
        });
        resolve();
      })
    });
  }

}
