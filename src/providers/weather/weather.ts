/**
 * This provider calls the Dark Sky API to provider live weather updates
 * https://darksky.net/dev/docs for API documentation
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
 */

// Framework Imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Providers
import { ConstantsProvider } from '../constants/constants';

// Models
import { WeatherResponseModel } from '../../models/weather-response-model';

@Injectable()
export class WeatherProvider {

  constructor(public http: HttpClient, private constantsProvider: ConstantsProvider) { }

  getWeatherForecast(lat: String, long: String, unit: String) : Observable<WeatherResponseModel> {
    // TODO for now units are hard coded to oC (si units)
    return this.http.get<WeatherResponseModel>(`${this.constantsProvider.weatherAPIUrl}${this.constantsProvider.weatherAPIKey}/${lat},${long}?units=${unit}`);
  }

  // As the icons which this appliction is using are not named the same as the string returned from the weather API
  // There is a need to map what is returned to match the icon library (http://adamwhitcroft.com/climacons/)
  // TO DO extend the icons to consider time of the day as the library provides sun-rise/set icons etc
  setWeatherIcon(apiIcon: string): string {
    let iconStr: string;
    switch (apiIcon) {
      case "clear-day":
        iconStr = "Sun";
        break;
      case "clear-night":
        iconStr = "Moon";
        break;
      case "rain":
        // TO DO extend this to consider how badly it's raining
        iconStr = "Cloud-Rain";
        break;
      case "snow":
        iconStr = "Cloud-Snow";
        break;
      case "sleet":
        iconStr = "Cloud-Hail";
        break;
      case "wind":
        iconStr = "Wind";
        break;
      case "fog":
        iconStr = "Cloud-Fog";
        break;
      case "cloudy":
        iconStr = "Cloud";
        break;
      case "partly-cloudy-day":
        iconStr = "Cloud-Sun";
        break;
      case "partly-cloudy-night":
        iconStr = "Cloud-Moon";
        break;
      default:
        // Default icon is the apiIcon is not handled
        iconStr = "Thermometer-50";
        break;
    }
    return iconStr;
  }

}
