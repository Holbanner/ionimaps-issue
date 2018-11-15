import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { AppAvailability } from '@ionic-native/app-availability';
import { MyApp } from './app.component';
import { IncidentPage } from '../pages/incident/incident';
import { IncidentMapPage } from '../pages/incident-map/incident-map';
import { SafePipe } from '../app/pipe';
import { KeysPipe } from '../app/object-keys-pipe';
import { SubHeaderComponent } from '../components/sub-header/sub-header';
import { TranslateModule, TranslateLoader } from 'ng2-translate/ng2-translate';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Push } from '@ionic-native/push';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { DatePicker } from '@ionic-native/date-picker';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Brightness } from '@ionic-native/brightness'
import { Device } from '@ionic-native/device';
import { Camera } from '@ionic-native/camera';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Calendar } from '@ionic-native/calendar';
import { Keyboard } from '@ionic-native/keyboard';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';


import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/fr';

registerLocaleData(localeFr, 'fr-FR');

@NgModule({
  declarations: [
    MyApp,
    SafePipe,
    KeysPipe,
    SubHeaderComponent,
    IncidentMapPage,
    IncidentPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      platforms: {
        ios: {
          scrollAssist: true,
          autoFocusAssist: false
        }
      }
    }),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    IncidentPage,
    IncidentMapPage,
  ],
  providers: [
    SplashScreen,
    StatusBar,
    DatePicker,
    Geolocation,
    HTTP,
    Device,
    InAppBrowser,
    SocialSharing,
    Brightness,
    Camera,
    NativeGeocoder,
    Push,
    GoogleMaps,
    Calendar,
    Keyboard,
    File,
    FileOpener,
    LaunchNavigator,
    AppAvailability,
    LocationAccuracy,
    OpenNativeSettings,
    Network,
    Diagnostic,
    AppVersion,
    { provide: ErrorHandler, useClass: IonicErrorHandler }, { provide: LOCALE_ID, useValue: "fr-FR" }
  ]
})
export class AppModule { }
