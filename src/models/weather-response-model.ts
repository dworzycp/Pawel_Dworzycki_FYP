export class WeatherResponseModel {
    latitude: number;
    longitude: number;
    timezone: string;
    currently: CurrentlyModel;
    hourly: HourlyModel;
    displayIcon: string;
    daily: DailyModel;
}

class CurrentlyModel {
    time: number;
    summary: string;
    icon: string;
    nearestStormDistance: number;
    precipIntensity: number;
    precipIntensityError: number;
    precipProbability: number;
    precipType: string;
    temperature: number;
    apparentTemperature: number;
    dewPoint: number;
    humidity: number;
    windSpeed: number;
    windBearing: number;
    visibility: number;
    cloudCover: number;
    pressure: number;
    ozone: number;
}

class DailyModel {
    data: DayModel[];
}

class DayModel {
    time: number;
    icon: string;
    temperatureHigh: number;
    displayIcon: string;
}

class HourlyModel {
    data: HourlyDataModel[];
}

export class HourlyDataModel {
    time: number;
    icon: string;
    temperature: number;
    displayIcon: string;
}