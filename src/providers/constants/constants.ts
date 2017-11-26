/**
 * This provider is responsible for keeping constants such as: URLs
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
 */

 // Framework Imports
import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsProvider {

  // API urls
  private googleUrl = "https://maps.googleapis.com/maps/api/";
  private weatherUrl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/";

  // API keys
  private googleKey = "AIzaSyDlguMKex8eRL2517LW_B1mGkdvbfaMT6c";
  private weatherKey = "5a4410731f03780271e8dc702fe7bfa7";

  constructor() {}

  get googleApiUrl(): String {
    return this.googleUrl;
  }

  get googleApiKey(): String {
    return this.googleKey;
  }

  get weatherAPIUrl(): String {
    return this.weatherUrl;
  }

  get weatherAPIKey(): String {
    return this.weatherKey;
  }

}
