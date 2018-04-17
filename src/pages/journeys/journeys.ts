/**
 * Page responisble for displaying predictions to the user
 * 
 * @author Pawel Dworzycki
 * @version 16/04/2018
 */

// Framework imports
import { Component } from '@angular/core';
import { NgClass } from "@angular/common";
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { GenericProvider } from "../../providers/generic/generic";
import { StateProvider } from "../../providers/state/state";

// Models
import { DayPrediction } from '../../models/prediction-model';

@Component({
  selector: 'page-journeys',
  templateUrl: 'journeys.html',
})
export class JourneysPage {

  page: String = "Journeys";

  viewingDay: String = "NOT SET";
  viewingDayNum: number;

  predictions: DayPrediction;

  constructor(public navCtrl: NavController, public navParams: NavParams, private genericProvider: GenericProvider, private stateProvider: StateProvider) {
    this.predictions = null;
    // Set default to today
    this.viewingDayNum = new Date().getDay();
    this.getViewingDayString();
    this.getPredictionsForViewingDay();
  }

  nextDay() {
    if (this.viewingDayNum != 6) {
      this.viewingDayNum = this.viewingDayNum + 1;
    }
    else {
      this.viewingDayNum = 0;
    }
    this.getViewingDayString();
    this.getPredictionsForViewingDay();
  }

  previousDay() {
    if (this.viewingDayNum != 0) {
      this.viewingDayNum = this.viewingDayNum - 1;
    }
    else {
      this.viewingDayNum = 6;
    }
    this.getViewingDayString();
    this.getPredictionsForViewingDay();
  }

  getViewingDayString() {
    this.viewingDay = this.genericProvider.dayNumToString(this.viewingDayNum);
  }

  getPredictionsForViewingDay() {
    this.predictions = this.stateProvider.predictions.getPredictionsForDayNum(this.viewingDayNum);
  }

}
