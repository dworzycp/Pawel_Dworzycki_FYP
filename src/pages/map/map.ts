/**
 * This page shows the user where they have been.
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
 */

// Framework imports 
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Providers
import { CurrentLocationProvider } from "../../providers/current-location/current-location";
import { StateProvider } from "../../providers/state/state";
import { ErrorHandlerProvider } from '../../providers/error-handler/error-handler';

// Google
declare var google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  public map;
  page: String = "Map";

  constructor(
    public navCtrl: NavController,
    private currentLocationProvider: CurrentLocationProvider, 
    private stateProvider: StateProvider,
    private errorHandlerProvider: ErrorHandlerProvider) { }

  ionViewDidLoad() {
    // Only load the map if it hasn't been loaded
    this.loadMap();
  }

  loadMap() {
    if (!localStorage.getItem("latitude") || !localStorage.getItem('longitude')) {
      throw new Error("NO_COORDS");
    }

    try {
      // Get co-ords for map centre
      let latCentre = parseFloat(localStorage.getItem('latitude'));
      let lngCentre = parseFloat(localStorage.getItem('longitude'));

      // Set map options
      let mapOptions = {
        center: new google.maps.LatLng(latCentre, lngCentre),
        zoom: 16,
        disableDefaultUI: true
      };

      // Set the map
      let mapElement = document.getElementById('map');
      this.map = new google.maps.Map(mapElement, mapOptions);

      // Set markers
      this.addLocationMarkers();
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "loadMap");
    }
  }

  centreMap() {
    try {
      this.currentLocationProvider.getCurrentLocation().then(() => {
        let location = new google.maps.LatLng(parseFloat(localStorage.getItem('latitude')), parseFloat(localStorage.getItem('longitude')));
        this.map.panTo(location);
      });
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "centreMap");
    }
  }

  addLocationMarkers() {
    try {
      this.stateProvider.visitedLocations.forEach(loc => {
        // TODO check if a marker already exists for this loc
        this.addMarker(loc);
      });
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "addLocationMarkers");
    }
  }

  private addMarker(location) {
    try {
      let marker = new google.maps.Marker({
        map: this.map,
        icon: './assets/img/red-pin.png',
        position: new google.maps.LatLng(location.lat, location.lng)
      });
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "addMarker");
    }
  }

}
