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

// Providers
import { ConstantsProvider } from '../constants/constants';
import { ErrorHandlerProvider } from '../error-handler/error-handler';
import { AuthenticationProvider } from "../authentication/authentication";
import { StateProvider } from "../state/state";

// Azure
import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class AzureProvider {

  private page: String = "AzureProvider";

  private client: any;          // Connection to the Azure Mobile App backend
  private GPSTable: any;        // Reference to the GPS table
  private UserTable: any;       // Reference to the User table
  private PredictionsTable: any;       // Reference to the Predictions table

  constructor(
    private constantsProvider: ConstantsProvider,
    private errorHandlerProvider: ErrorHandlerProvider,
    private authenticationProvider: AuthenticationProvider,
    private stateProvider: StateProvider) {
    // Set up connection with Azure DB
    this.client = new WindowsAzure.MobileServiceClient(this.constantsProvider.azureAPIUrl);
    // Set up references to tables
    this.GPSTable = this.client.getTable('GPS_Coords');
    this.UserTable = this.client.getTable('Users');
    this.PredictionsTable = this.client.getTable('Predictions');

    this.getPredictions();
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
      .where({ UserID: this.authenticationProvider.userId })
      .read()
      .then(success => {
        this.savePredictions(success);
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
    // Create a prediction model
    predictions.forEach(pred => {
      let prediction = new JourneyModel;
      prediction.userId = pred.UserID;
      prediction.originClusterName = pred.OriginClusterName;
      prediction.destClusterName = pred.DestClusterName;
      prediction.leaveTime = pred.LeaveTime;
      prediction.enterTime = pred.EnterTime;
      // Add prediction 
      this.stateProvider.predictions.addPredictionForDate(prediction.leaveTime, prediction);
    });

  }

}
