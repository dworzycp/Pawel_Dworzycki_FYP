/**
 * This provider is responsible for connecting the app to Azure
 * 
 * @author Pawel Dworzycki
 * @version 16/04/2018
 */

// Framework imports
import { Injectable } from '@angular/core';

// Models
import { SimpleLocationModel } from "../../models/simple-location-model";
import { JourneyModel } from "../../models/journey-model";
import { ClusterModel } from '../../models/clutser-model';
import { PredictionModel } from '../../models/prediction-model';
import { WeatherResponseModel } from "../../models/weather-response-model";

// Providers
import { ConstantsProvider } from '../constants/constants';
import { ErrorHandlerProvider } from '../error-handler/error-handler';
import { AuthenticationProvider } from "../authentication/authentication";
import { StateProvider } from "../state/state";
import { WeatherProvider } from "../weather/weather";

// Azure
import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class AzureProvider {

  private page: String = "AzureProvider";

  private client: any;          // Connection to the Azure Mobile App backend
  private GPSTable: any;        // Reference to the GPS table
  private UserTable: any;       // Reference to the User table
  private PredictionsTable: any;       // Reference to the Predictions table
  private ClustersTable: any;   // Refernece to the Clusters table

  constructor(
    private constantsProvider: ConstantsProvider,
    private errorHandlerProvider: ErrorHandlerProvider,
    private authenticationProvider: AuthenticationProvider,
    private stateProvider: StateProvider,
    private weatherProvider: WeatherProvider) {
    // Set up connection with Azure DB
    this.client = new WindowsAzure.MobileServiceClient(this.constantsProvider.azureAPIUrl);
    // Set up references to tables
    this.GPSTable = this.client.getTable('GPS_Coords');
    this.UserTable = this.client.getTable('Users');
    this.PredictionsTable = this.client.getTable('Predictions');
    this.ClustersTable = this.client.getTable('Clusters');
  }

  sendGPSCoordinates() {
    this.stateProvider.unsentCoords.forEach(coord => {
      let item = { actual_createdAt: coord.createdAt, latitude: coord.lat, longitude: coord.lng, user_id: this.authenticationProvider.userId };
      this.stateProvider.addGpsStatus("Sending " + coord.lat + ", " + coord.lng + " to Azure");

      this.GPSTable.insert(item).then(success => {
        let index = this.stateProvider.unsentCoords.indexOf(coord);
        this.stateProvider.unsentCoords.splice(index, 1);
        this.stateProvider.addGpsStatus(coord.lat + ", " + coord.lng + " sent to Azure");

        // Update list of visited locations for debug
        let debugIndex = this.stateProvider.visitedLocations.indexOf(coord);
        this.stateProvider.visitedLocations[debugIndex].sentToAzure = true;
      },
        error => {
          this.stateProvider.addGpsStatus("Failed to send " + coord.lat + ", " + coord.lng + " to Azure");
          this.errorHandlerProvider.handleError(error.message, this.page, "sendGPSCoordinates");
        });
    });
  }

  public isNewUser() {
    this.UserTable
      .where({ userId: this.authenticationProvider.userId })
      .read()
      // TODO bug, this doesn't work as expected - sends data everytime
      // .then(success, failure) -- if there is a user, i.e.: success donothing
      .then(this.doNothing(), this.createReferenceToUserInDB());
  }

  public getPredictions() {
    this.PredictionsTable
      .where({ UserID: "114111123049044689311" })
      //.where({ UserID: this.authenticationProvider.userId })
      .read()
      .then(success => {
        this.savePredictions(success);
      }, err => {
        alert(err);
      });
  }

  getClusters() {
    this.ClustersTable
      .where({ userId: "114111123049044689311" })
      //.where({ UserID: this.authenticationProvider.userId })
      .read()
      .then(success => {
        this.saveClusters(success);
      }, err => {
        alert(err);
      });
  }

  createReferenceToUserInDB() {
    let user = {
      userId: this.authenticationProvider.userId,
      userFirstName: this.authenticationProvider.userGivenName,
      userLastName: this.authenticationProvider.userLastName,
      userEmail: this.authenticationProvider.userEmail
    };

    try {
      this.UserTable.insert(user);
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "createReferenceToUserInDB");
    }
  }

  doNothing() { }

  savePredictions(predictions) {
    this.stateProvider.predictions = new PredictionModel;

    // Create a prediction model
    predictions.forEach(pred => {
      let prediction = new JourneyModel;
      prediction.userId = pred.UserID;
      // Origin
      prediction.originClusterName = pred.OriginClusterName;
      prediction.originClusterID = pred.OriginClusterID;
      prediction.originClutserLat = pred.origin_lat;
      prediction.originClusterLong = pred.origin_long;
      prediction.leaveTime = pred.LeaveTime;
      // Dest
      prediction.destClusterName = pred.DestClusterName;
      prediction.destClusterID = pred.DestClusterID;
      prediction.destClutserLat = pred.dest_lat;
      prediction.destClusterLong = pred.dest_long;
      prediction.enterTime = pred.EnterTime;
      // Add prediction 
      this.stateProvider.predictions.addPredictionForDate(prediction.leaveTime, prediction);
    });
  }

  saveClusters(clusters) {
    this.stateProvider.clusters = new Map<number, ClusterModel>();

    clusters.forEach(c => {
      let cluster = new ClusterModel;
      cluster.lat = c.c_centre_lat;
      cluster.long = c.c_centre_long;
      cluster.name = c.c_label;
      cluster.id = c.c_id;
      // Add cluster
      this.stateProvider.addCluster(cluster);
    });

    // Foreach clutser, get weather
    // TODO find a better place for this
    try {
      this.stateProvider.clusters.forEach(c => {
        this.weatherProvider.getWeatherForecast(c.lat, c.long, "si").subscribe(success => {
          c.weather = new WeatherResponseModel();
          c.weather = success;
          // Convert temp from a float to an int
          c.weather.currently.temperature = parseInt(c.weather.currently.temperature.toString());
          // Convert icons' string to an icon in the assets folder
          // TODO should probably be done in the service
          c.weather.displayIcon = this.weatherProvider.setWeatherIcon(c.weather.currently.icon);
          c.weather.hourly.data.forEach(hour => {
            hour.temperature = parseInt(hour.temperature.toString());
            hour.displayIcon = this.weatherProvider.setWeatherIcon(hour.icon);
          });
          c.weather.daily.data.forEach(day => {
            day.temperatureHigh = parseInt(day.temperatureHigh.toString());
            day.displayIcon = this.weatherProvider.setWeatherIcon(day.icon);
          });
        });
      });
    } catch (error) {
      console.log(error);
    }

  }

}
