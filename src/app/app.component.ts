import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Nav, Platform, MenuController, Config, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { IncidentPage } from '../pages/incident/incident';



declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  tabBarElement: any;
  subscription: Subscription;
  onResumeSubscription: Subscription;
  connectionState: boolean;
  socialLinks: any;
  pages: Array<{ title: string, component: any }>;
  paramPages: Array<{ title: string, component: any }>;

  constructor(
    public alertCtrl: AlertController,
    public platform: Platform,
    public menu: MenuController,
    public config: Config,
    public storage: Storage,
    public events: Events,
    public splashScreen: SplashScreen,
    public statusBar: StatusBar,
    public inAppBrowser: InAppBrowser,
    public sanitization: DomSanitizer,
  ) {
    this.rootPage = IncidentPage;
  }

  ngOnDestroy() {

  }


}