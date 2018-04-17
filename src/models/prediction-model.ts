/**
 * Models predictions for the user.
 * 
 * @author Pawel Dworzycki
 * @version 16/04/2018
 */

import { JourneyModel } from "./journey-model";
import { DayOfWeek } from "./day-of-week";
import { DateTime } from "ionic-angular";

export class PredictionModel {

    days: Map<DayOfWeek, DayPrediction>;

    constructor() {
        this.days = new Map<DayOfWeek, DayPrediction>();
    }

    public addPredictionForDay(day: DayOfWeek, prediction: JourneyModel) {
        try {
            // Check if the day of the week exists
            if (this.days[day] == null) {
                // Day does not exist in the Map, add it
                //this.days.set(day, new DayPrediction(day));
                this.days[day] = new DayPrediction(day);
                // Add the prediction
                this.days[day].addJourney(prediction);
            }
            else {
                // Day does exist, add a prediction for it
                this.days[day].addJourney(prediction);
            }
        } catch (error) {
            console.log(error);
        }
    }

    public addPredictionForDate(date: Date, prediction: JourneyModel) {
        let day = this.DateToDay(date.getDay());
        this.addPredictionForDay(day, prediction);
    }

    public getPredictionsForDay(day: DayOfWeek): DayPrediction {
        if (this.days[day] != null) {
            return this.days[day];
        }
        else {
            return null;
        }
    }

    public getPredictionsForDayNum(dayNum: number): DayPrediction {
        let day = this.DateToDay(dayNum);
        return this.getPredictionsForDay(day);
    }

    private DateToDay(dayNum: number): DayOfWeek {
        switch (dayNum) {
            case 0:
                return DayOfWeek.SUNDAY;
            case 1:
                return DayOfWeek.MONDAY;
            case 2:
                return DayOfWeek.TUESDAY;
            case 3:
                return DayOfWeek.WEDNESDAY;
            case 4:
                return DayOfWeek.THURSDAY;
            case 5:
                return DayOfWeek.FRIDAY;
            case 6:
                return DayOfWeek.SATURDAY;
        }
    }

    public numOfTotalPredictions(): number {
        return this.days.size;
    }

}

export class DayPrediction {

    private dayOfWeek: DayOfWeek;
    private journeys: JourneyModel[];

    constructor(dayOfWeek: DayOfWeek) {
        this.dayOfWeek = dayOfWeek;
        this.journeys = new Array<JourneyModel>();
    }

    public addJourney(journey: JourneyModel) {
        this.journeys.push(journey);
    }

    public getJourneys() {
        return this.journeys;
    }

    public getWatherForJourneys() {
        this.journeys.forEach(j => {
            
        });
    }

}

