import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from "../pages/map/map";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WeatherProvider } from '../providers/weather/weather';
import { ConstantsProvider } from '../providers/constants/constants';
import { StateProvider } from '../providers/state/state';
import { CurrentLocationProvider } from '../providers/current-location/current-location';
import { GenericProvider } from '../providers/generic/generic';
import { ErrorHandlerProvider } from '../providers/error-handler/error-handler';
import { BackgroundModeProvider } from '../providers/background-mode/background-mode';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WeatherProvider,
    ConstantsProvider,
    StateProvider,
    CurrentLocationProvider,
    GenericProvider,
    BackgroundMode,
    Geolocation,
    ErrorHandlerProvider,
    BackgroundModeProvider
  ]
})
export class AppModule {}
