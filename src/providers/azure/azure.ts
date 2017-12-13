/**
 * This provider is responsible for connecting the app to Azure
 * 
 * @author Pawel Dworzycki
 * @version 08/12/2017
 */

// Framework imports
import { Injectable } from '@angular/core';

// Models
import { SimpleLocationModel } from "../../models/simple-location-model";

// Providers
import { ConstantsProvider } from '../constants/constants';
import { ErrorHandlerProvider } from '../error-handler/error-handler';

// Azure
import * as WindowsAzure from 'azure-mobile-apps-client';

@Injectable()
export class AzureProvider {

  private page: String = "AzureProvider";

  private client: any;
  private GPSTable: any;

  constructor(
    private constantsProvider: ConstantsProvider,
    private errorHandlerProvider: ErrorHandlerProvider ) {
    this.client = new WindowsAzure.MobileServiceClient(this.constantsProvider.azureAPIUrl);
    this.GPSTable = this.client.getTable('GPS_Coords');
  }

  saveGPSCoordinates(coords: SimpleLocationModel) {
    // TODO get userId from authentication service
    let item = { latitude: coords.lat, longitude: coords.lng, user_id: "1" };

    try {
      this.GPSTable.insert(item);
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "saveGPSCoordinates");
    }
  }

}
