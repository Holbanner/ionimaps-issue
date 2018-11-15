/**
//GELOCATION PLUGIN
ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="L'application a besoin de vous localiser pour l'envoi de signalements" && npm install --save @ionic-native/geolocation

//MAPS PLUGIN
Android:
iOS:

//desinstallation
ionic cordova plugin rm cordova-plugin-googlemaps && ionic cordova plugin rm com.googlemaps.ios

//installation plugin classique
ionic cordova plugin add cordova-plugin-googlemaps --variable API_KEY_FOR_ANDROID="" --variable API_KEY_FOR_IOS="" --no-fetch
npm install --save @ionic-native/google-maps
 */
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { IncidentMapPage } from '../incident-map/incident-map';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder'
import { Utils } from '../../utils/utils';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import * as appConfig from '../../config';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';


@Component({
  selector: 'page-incident',
  templateUrl: 'incident.html'
})
/**
 * Page de déclaration d'incidents
 */
export class IncidentPage {
  incidentForm: FormGroup;
  selectedAction: any;
  actionHeader: any;
  categories: Array<{ code: string, name: string, codeMetier: string }>;
  pictures: Array<{ b64: string, displayedImage: any }>;
  photosLimit: number = 2;
  objectAddress: any = {};
  geoAddress: string = "";
  geoloader: any;
  labels: any;
  codeQualificationMetier: string = "SIGNALINCI";
  selectedcodeQualificationMetier: string;
  emailRequested: boolean;
  ticketNumber: string = "";
  configHasBeenOpened: boolean = false;
  photoHasBeenOpened: boolean = false;
  alreadyLoading: boolean;
  onResumeSubscription: Subscription;
  geoLocStatuts: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public sheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder,
    public translate: TranslateService,
    public domSanitizer: DomSanitizer,
    public camera: Camera,
    public nativeGeocoder: NativeGeocoder,
    public storage: Storage,
    public device: Device,


  ) {

  }


  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  /**
   * Ouvre la carte dans une modal
   */
  openMap() {
    console.log("incident.openMap");
    //Envoi des coordonnées de Geolocation à la place. Sur la page de maps,
    let modal = this.modalCtrl.create(IncidentMapPage, { "address": this.geoAddress });
    modal.onWillDismiss(() => {
      let appRoot = <HTMLCollectionOf<any>>document.getElementsByClassName("app-root");
      appRoot[0].style.opacity = 1;
    });
    modal.present();
    modal.onDidDismiss(data => {
      console.log("MODAL DISMISS WITH DATA", data);
      if (data != undefined) {
        this.objectAddress = data.address;
        if (this.objectAddress != undefined) {
          this.geoAddress = this.objectAddress.stringifiedAddress;
        }
      }
    });
  }
}