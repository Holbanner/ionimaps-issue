import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, NavController, NavParams, ViewController, AlertController, LoadingController, ToastController } from 'ionic-angular'; //Content
import { GoogleMaps, GoogleMap, GoogleMapsEvent, CameraPosition, Marker, MarkerOptions, MyLocation, GoogleMapOptions } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder'
import { TranslateService } from 'ng2-translate';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'page-incident-map',
	templateUrl: 'incident-map.html'
})
/**
 * page modal avec la google map
 */
export class IncidentMapPage {
	// @ViewChild(Content) content: Content;
	appRoot: any;
	gMap: GoogleMap;
	mapHTML: HTMLElement;
	currentMarker: Marker;
	geoloader: any;
	geoAddress: string = "";
	pageTitle: string = this.translate.instant("INCIDENT.MAP.PAGE_TITLE");
	returnedAddressObject: object;
	@ViewChild('map')
	private mapElement: ElementRef;

	constructor(
		public viewCtrl: ViewController,
		public navCtrl: NavController,
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public toastCtrl: ToastController,
		public googleMaps: GoogleMaps,
		public nativeGeocoder: NativeGeocoder,
		public translate: TranslateService,
		public platform: Platform,
		private diagnostic: Diagnostic,
		public storage: Storage,
	) {
		this.geoAddress = navParams.get('address');
		this.returnedAddressObject = {};
		this.returnedAddressObject["address"] = {}; //Initialisation de l'adresse si aucun résultat
	}

	ionViewDidEnter() {
		this.platform.ready().then(() => {
			this.loadMap();
		});
	}

	ionViewWillLeave() {
		if (this.geoloader) {
			this.geoloader.dismiss();
		}
	}

	ionViewDidLeave() {
		console.log("removing map");
		this.appRoot.style.opacity = 1;
		this.gMap.remove();
	}

    /**
     * Charge la carte
     */
	loadMap() {
		console.log("loadMap()");
		this.mapHTML = document.getElementById('map');
		this.gMap = GoogleMaps.create(this.mapHTML);
		let appRoot = <HTMLCollectionOf<any>>document.getElementsByClassName("app-root");
		this.appRoot = appRoot[1];
		this.appRoot.style.opacity = 0;

		this.gMap.one(GoogleMapsEvent.MAP_READY).then(() => {
			// console.log("maps created");
			// if (this.geoAddress != "") {
			// 	this.getCoordinatesFromAddress();
			// 	// if(this.geoloader != ""){
			// }
			// else {
			// 	this.diagnostic.isLocationEnabled().then((LocState) => {
			// 		console.log('retour diagnostic :' + LocState);
			// 		if (LocState == true) {
			// 			this.diagnostic.getLocationAuthorizationStatus().then(status => {
			// 				if (status == 'GRANTED' || status == 'authorized_when_in_use') {
			// 					this.goToCurrentPosition();
			// 				}
			// 			}, (error) => { console.log('erreur plugin diagnostic:' + error) });
			// 			;
			// 		}
			// 	},
			// 		(error) => { console.log('erreur plugin diagnostic:' + error) })

			// }
			// this.storage.get('PinMessageState').then(rep => {
			// 	console.log(rep)
			// 	if (rep != 'true') {
			// 		this.showPinMessage()
			// 	}
			// })

			// //Si il y a un click long sur la carte
			// //On récupère les coordonnées correspondantes et on les utilise comme marqueur actuel
			// this.gMap.on(GoogleMapsEvent.MAP_LONG_CLICK).subscribe((data) => {
			// 	if (data[0].lat != null && data[0].lng != null) {
			// 		this.getAddressFromCoordinates(data[0].lat, data[0].lng, true);
			// 	}
			// });
		}).catch(error => {
			console.log("maps creation error", error);
		});
	}

	// 	showPinMessage() {
	// 		let alert = this.alertCtrl.create({
	// 			title: 'Astuce',
	// 			message: "Pour déplacer le curseur sur la carte, appuyez longuement à l'emplacement souhaité",
	// 			buttons: [
	// 				{
	// 					text: 'Ne plus afficher ce message',
	// 					role: 'cancel',
	// 					handler: () => {
	// 						this.storage.set('PinMessageState', 'true')
	// 					}
	// 				},
	// 				{
	// 					text: 'Ok',
	// 					handler: () => {
	// 						console.log('incident map : Ok clicked')
	// 					}
	// 				}
	// 			]
	// 		});
	// 		alert.present();
	// 	}

	// 	/**
	//  * Va à la localisation actuelle
	//  */
	// 	goToCurrentPosition() {
	// 		console.log("goToCurrentPosition");
	// 		this.gMap.getMyLocation().then((location: MyLocation) => {
	// 			console.log("getMyLocation result", location);
	// 			if (!location) {
	// 				this.geoNotFound();
	// 			}
	// 			else {
	// 				this.getAddressFromCoordinates(location.latLng.lat, location.latLng.lng);
	// 				console.log("goToCurrentPosition getAddressFromCoordinates");
	// 				let position: CameraPosition<any> = {
	// 					target: {
	// 						lat: location.latLng.lat,
	// 						lng: location.latLng.lng
	// 					},
	// 					zoom: 18,
	// 				};
	// 				this.gMap.moveCamera(position);
	// 			}
	// 		}).catch(error => {
	// 			console.log("getMyLocation() error", error);
	// 			//Invalid action
	// 		});
	// 	}

	//     /**
	//      * Affiche un loader lors de la géolocalisation
	//      */
	// 	showGeoloder() {
	// 		this.geoloader = this.loadingCtrl.create({
	// 			content: this.translate.instant("INCIDENT.MAP.GEOLOCATION.CURRENT_GEOLOCATION")
	// 		});
	// 		this.geoloader.present();
	// 	}

	//     /**
	//      * cache le loader
	//      */
	// 	hideGeoloder() {
	// 		if (this.geoloader) {
	// 			this.geoloader.dismiss();
	// 		}
	// 	}

	//     /**
	//      * Affiche un message lorsqu'aucune adresse n'est trouvée
	//      */
	// 	geoNotFound() {
	// 		// let alertNotFound = this.alertCtrl.create({
	// 		//  	title: 'Aucun résultat',
	// 		//  	buttons: ['OK']
	// 		// });
	// 		// alertNotFound.present();

	// 		let toast = this.toastCtrl.create({
	// 			message: this.translate.instant("INCIDENT.MAP.GEOLOCATION.NO_RESULT"),
	// 			duration: 3000,
	// 			position: 'bottom'
	// 		});

	// 		toast.present();
	// 		this.hideGeoloder();
	// 	}

	//     /**
	//      * Récupère une adresse à partir de coordonnées
	//      * @param {number} lat [description]
	//      * @param {number} lng [description]
	//      */
	// 	getAddressFromCoordinates(lat: number, lng: number, fromLongClick?: boolean) {
	// 		console.log("getAddressFromCoordinates()");
	// 		// if(fromLongClick !== true){
	// 		this.showGeoloder();
	// 		// }
	// 		let request = {
	// 			'position': { "lat": lat, "lng": lng }
	// 		};

	// 		this.nativeGeocoder.reverseGeocode(lat, lng).then((result: NativeGeocoderReverseResult[]) => {
	// 			if (result) {
	// 				console.log("getAddressFromCoordinates result", result);
	// 				// setTimeout(() => {
	// 				this.geoAddress = this.utils.convertLocationToAddress(result[0])
	// 				this.returnedAddressObject = [];
	// 				this.returnedAddressObject = { lat: lat, lng: lng, address: result[0], stringifiedAddress: this.geoAddress };
	// 				let markerOptions: MarkerOptions = {
	// 					title: this.geoAddress,
	// 					position: {
	// 						lat,
	// 						lng
	// 					}
	// 				}
	// 				if (this.currentMarker) {
	// 					this.currentMarker.remove();
	// 				}
	// 				this.gMap.addMarker(markerOptions).then(marker => {
	// 					this.currentMarker = marker;
	// 					// if(fromLongClick !== true){
	// 					this.hideGeoloder();
	// 					// }
	// 				});
	// 				// }, 0);
	// 			}
	// 			else {
	// 				// if(fromLongClick !== true){
	// 				this.hideGeoloder();
	// 				// }
	// 			}
	// 		});
	// 	}

	// 	/**
	// 	 * Récupère des coordonnées à partir d'une adresse
	// 	 */
	// 	getCoordinatesFromAddress() {
	// 		console.log("getCoordinatesFromAddress()");
	// 		if (this.geoAddress == null || this.geoAddress == "") {
	// 			console.log("address not found");
	// 			this.geoNotFound();
	// 			// this.content.scrollToTop();
	// 		}
	// 		else {
	// 			console.log("address found");
	// 			this.showGeoloder();
	// 			// this.content.scrollToTop();
	// 			// if(document.getElementById("map").style.backgroundColor != "transparent"){
	// 			//   	document.getElementById("map").style.backgroundColor = "transparent";
	// 			// }
	// 			//mettre alert de chargement
	// 			let request = {
	// 				'address': this.geoAddress
	// 			}

	// 			console.log("get coo from ", this.geoAddress);

	// 			this.nativeGeocoder.forwardGeocode(this.geoAddress).then((result: NativeGeocoderForwardResult[]) => {
	// 				if (result) {
	// 					console.log("getCoordinatesFromAddress result", result);
	// 					this.returnedAddressObject = [];
	// 					this.returnedAddressObject = { lat: Number(result[0].latitude), lng: Number(result[0].longitude), stringifiedAddress: this.geoAddress };

	// 					//Récupération de l'adresse sous forme d'objet
	// 					this.nativeGeocoder.reverseGeocode(Number(result[0].latitude), Number(result[0].longitude)).then((reversedResult: NativeGeocoderReverseResult[]) => {
	// 						console.log("TEST !!! reversedResult", reversedResult);
	// 						if (reversedResult) {
	// 							this.returnedAddressObject["address"] = reversedResult;
	// 						}
	// 					});
	// 					let markerOptions: MarkerOptions = {
	// 						title: this.geoAddress,
	// 						position: {
	// 							lat: Number(result[0].latitude),
	// 							lng: Number(result[0].longitude)
	// 						}
	// 					};
	// 					if (this.currentMarker) {
	// 						this.currentMarker.remove();
	// 					}

	// 					this.gMap.addMarker(markerOptions).then(marker => {
	// 						this.currentMarker = marker;
	// 						let cam_position: CameraPosition<any> = {
	// 							target: {
	// 								lat: Number(result[0].latitude),
	// 								lng: Number(result[0].longitude)
	// 							},
	// 							zoom: 18,
	// 						};
	// 						this.gMap.moveCamera(cam_position).then(() => {
	// 							this.hideGeoloder();
	// 						}).catch(error => {
	// 							this.hideGeoloder();
	// 							console.log("gMap error" + error);
	// 						});
	// 					}).catch(error => {
	// 						this.hideGeoloder();
	// 						console.log("addMarker error" + error);
	// 					});
	// 				} else {
	// 					this.geoNotFound();
	// 				}
	// 			}).catch(error => {
	// 				console.log("forwardGeocode error");
	// 				this.geoNotFound();
	// 			});
	// 		}
	// 	}

	// 	/**
	// 	 * Remet l'adresse à 0
	// 	 */
	// 	clearAdress() {
	// 		this.geoAddress = "";
	// 	}

	// 	/**
	// 	 * Retour à la page de déclaration d'incident
	// 	 * en passant l'objet d'adresse obtenu en retur
	// 	 */
	// 	goBack() {
	// 		let data = { "address": this.returnedAddressObject };
	// 		this.viewCtrl.dismiss(data);
	// 	}
}