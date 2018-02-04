/**
 * This provider is responsible for connecting the app to Azure
 * 
 * @author Pawel Dworzycki
 * @version 03/02/2018
 */

// Framework imports
import { Injectable } from '@angular/core';

// Models
import { SimpleLocationModel } from "../../models/simple-location-model";

// Providers
import { ConstantsProvider } from '../constants/constants';
import { ErrorHandlerProvider } from '../error-handler/error-handler';
import { AuthenticationProvider } from "../authentication/authentication";

// Azure
import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class AzureProvider {

  private page: String = "AzureProvider";

  private client: any;
  private GPSTable: any;

  constructor(
    private constantsProvider: ConstantsProvider,
    private errorHandlerProvider: ErrorHandlerProvider,
    private authenticationProvider: AuthenticationProvider) {
    this.client = new WindowsAzure.MobileServiceClient(this.constantsProvider.azureAPIUrl);
    this.GPSTable = this.client.getTable('GPS_Coords');
  }

  saveGPSCoordinates(coords: SimpleLocationModel) {
    let item = { latitude: coords.lat, longitude: coords.lng, user_id: this.authenticationProvider.userId };

    try {
      this.GPSTable.insert(item);
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "saveGPSCoordinates");
    }
  }

}
