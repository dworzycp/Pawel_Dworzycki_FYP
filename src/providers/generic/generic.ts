/**
 * This provider provides generic methods and utilities which can be implemented
 * by other classes.
 * 
 * @author Pawel Dworzycki
 * @version 16/04/2018
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

  /**
   * Returns the time difference between now and a passed date.
   * Returns an array with 3 indexes:
   *                                 [0] hours
   *                                 [1] minutes
   *                                 [2] seconds
   * @param date 
   */
  howLongSinceDate(date: Date): Number[] {
    // Get the time now in milliseconds
    let timeNow = new Date().getTime();
    // Get the time passed in milliseconds
    let timePassed = date.getTime();
    // Difference in times
    let timeDiff = timeNow - timePassed;

    // Format the time to hrs : mins : seconds
    let seconds = timeDiff / 1000;
    let mins = seconds / 60;
    let hours = mins / 60;

    // Create return array
    let arr = new Array<Number>();
    arr.push(hours);
    arr.push(mins);
    arr.push(seconds);

    // Return
    return arr;
  }

  dayNumToString(day: Number): String {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  }

}
