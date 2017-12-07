/**
 * Provider designed to handle errors
 * 
 * @author Pawel Dworzycki
 * @version 07/12/2017
 */

// Framework imports
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorHandlerProvider {

  constructor() { }

  handleError(error: String, page: String, method: String) {
    // For now just alert the error
    // In the future it might be logged to an online service
    // TODO check if in prod mode, if NOT put more details, if YES make the messages user friendly
    alert(`${page} :: ${method} :: ${this.traslateErrorString(error)}`);
  }

  private traslateErrorString(error: String): String {
    switch (error) {
      case "NO_COORDS":
        return "No available co-ordinates.";
      default:
        return error;
    }
  }

}
