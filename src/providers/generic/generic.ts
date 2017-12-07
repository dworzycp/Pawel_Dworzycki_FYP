/**
 * This provider provides generic methods and utilities which can be implemented
 * by other classes.
 * 
 * @author Pawel Dworzycki
 * @version 26/11/2017
 */

// Framework
import { Injectable } from '@angular/core';

// Providers
import { ErrorHandlerProvider } from '../error-handler/error-handler';

@Injectable()
export class GenericProvider {

  page: String = "GenericProvider";

  constructor(private errorHandlerProvider: ErrorHandlerProvider) { }

  convertUNIXtoUTC(unixTime: number, returnTimeOnly?: boolean): any {
    try {
      // Multiply by 1000 to convert it into milliseconds
      let date = new Date(unixTime * 1000);
      let year = date.getFullYear();
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let month = months[date.getMonth()];
      // Get hour and if the hour is a single digit add a 0 infront
      var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      // Get minutes and if the minute is a single digit add a 0 infront
      var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

      if (returnTimeOnly) {
        return `${hour}:${min}`;
      } else {
        return `${date.getDate()} ${month} ${year} ${hour}:${min}`;
      }
    } catch (error) {
      this.errorHandlerProvider.handleError(error.message, this.page, "convertUNIXtoUTC");
    }
  }

}
