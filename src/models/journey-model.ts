import { StateProvider } from "../providers/state/state";
import { ClusterModel } from "./clutser-model";

export class JourneyModel {
    userId: String;
    temp_oc: String;
    icon: String;

    // Origin
    originClusterName: String;
    originClusterID: number;
    originClutserLat: number;
    originClusterLong: number;
    leaveTime: Date;

    // Destination
    destClusterName: String;
    destClusterID: number;
    destClutserLat: number;
    destClusterLong: number;
    enterTime: Date;

    getWeather(cluster: ClusterModel) {
        let forecast = cluster.getWeatherForDate(this.leaveTime);
        this.temp_oc = forecast[0];
        this.icon = forecast[1];
    }
}