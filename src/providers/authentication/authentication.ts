/**
 * Provider responsible for handling login and authentication
 * 
 * @author Pawel Dworzycki
 * @version 02/02/2018
 */

// Framework imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Models
import { UserObjectModel } from "../../models/user-object-model";

@Injectable()
export class AuthenticationProvider {

  private userObject: UserObjectModel;

  constructor(public http: HttpClient) {
    this.userObject = new UserObjectModel();
  }

  setUserObject(userObject) {
    this.userObject = userObject;
  }

  get userGivenName(): String {
    return this.userObject.givenName;
  }

  get userImageUrl(): String {
    return this.userObject.imageUrl;
  }

  get userId(): String {
    return this.userObject.userId;
  }

}
