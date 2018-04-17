// Providers
import { WeatherProvider } from "../providers/weather/weather";

// Models
import { WeatherResponseModel } from "./weather-response-model";

export class ClusterModel {
    name: string;
    id: number;
    lat: string;
    long: string;
    weather: WeatherResponseModel;

    getWeather(weatherProvider: WeatherProvider) {

    }

    getWeatherForDate(date: Date): string[] {
        let rtnVal = new Array<string>();
        // Need to know if the date is within the next 48 hours (hourly breakdown)
        // Otherwise, Dark Sky only offers daily forecast
        // They do offer a option to call an API with a specifci time, but that would mean a lot of requests
        console.log(this.weather);
        if (this.howLongSinceDate(date)[0] < 0 && this.howLongSinceDate(date)[0] > -48) {
            // Look inside hourly
            this.weather.hourly.data.forEach(hour => {
                // Check if the timestamp matches
                // Remove minutes
                let roundedHour = new Date(date.getTime() - (date.getMinutes())*60000);
                let time: number = parseInt((roundedHour.getTime() / 1000).toFixed(0));
                if (hour.time == time) {
                    rtnVal[0] = hour.temperature.toString() + "°C";
                    rtnVal[1] = hour.icon;
                }
            });
        }

        // FAKE
        // rtnVal[0] = null;
        // rtnVal[1] = null;
        return rtnVal;
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

}