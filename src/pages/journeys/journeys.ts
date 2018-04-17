/**
 * Page responisble for displaying predictions to the user
 * 
 * @author Pawel Dworzycki
 * @version 17/04/2018
 */

// Framework imports
import { Component } from '@angular/core';
import { NgClass } from "@angular/common";
import { NavController, NavParams } from 'ionic-angular';

// Providers
import { GenericProvider } from "../../providers/generic/generic";
import { StateProvider } from "../../providers/state/state";
import { AzureProvider } from '../../providers/azure/azure';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private genericProvider: GenericProvider,
    private stateProvider: StateProvider,
    private azureProvider: AzureProvider) {
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

    // TODO find a better place of doing this
    // Get weather for predictions
    if (this.predictions != null) {
      this.predictions.getJourneys().forEach(pred => {
        // Get the cluster this journey blongs to -- TODO should be done in the journey model?
        let c = this.stateProvider.clusters.get(parseInt(pred.originClusterID.toString()));
        pred.getWeather(c);
      });
    }

  }

  refresh() {
    this.azureProvider.getPredictions();
  }

}
