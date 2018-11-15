import { Component, Input } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService } from 'ng2-translate';
import { Calendar } from '@ionic-native/calendar';

@Component({
  selector: 'sub-header',
  templateUrl: 'sub-header.html'
})
/**
 * Header de deuxième niveau
 * avec les boutons de favoris, de partage, et de retour
 */
export class SubHeaderComponent {

  isSharable: boolean = false;
  isFavorizable: boolean = false;
  isEvent: boolean = false;
  typeActus: any;
  // isInfo: boolean = false;
  item: any;
  title: string;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public socialSharing: SocialSharing,
    public calendar: Calendar,
    private platform: Platform
  ) {

  }
  /**
   * Définit les données qui seront utilisées sur la vue
   * Pour afficher tel ou tel élément
   */
  @Input()
  set data(item: any) {
    console.log("item : ", item);
    if (item != null) {
      this.item = item;
      if (this.item.LibUrl) { //news
        this.isSharable = true;
        this.typeActus = this.item.TypActualite;
        this.item
      }
      if (this.item.IsEvenement === true) {
        this.isEvent = true;
      }
      this.title = this.item.title;
    }
  }
  // @Input()
  // set backButton(iten: any) {
  //   console.log("maybe it works :" + iten);
  //   if (iten != null) {
  //     this.isInfo = iten.isInfo;
  //   }
  // }
  get data() {
    return this.item;
  }

  /**
   * Retour à la page précédente
   * Au clic sur le bouton de retour
   */
  goBack() {
    this.navCtrl.pop();
  }

  /**
   * Demande à l'utilisateur s'il veut ajouter l'évènement à son agenda personnel
   */
  askAddToAgenda() {
    let addAlert = this.alertCtrl.create({
      title: this.translate.instant("CALENDAR.ASK.TITLE"),
      message: this.translate.instant("CALENDAR.ASK.MESSAGE"),
      buttons: [
        {
          text: this.translate.instant("CALENDAR.ASK.DECLINE"),
          role: "cancel",
          handler: () => {
          }
        },
        {
          text: this.translate.instant("CALENDAR.ASK.ACCEPT"),
          handler: () => {
            addAlert.dismiss().then(() => {
              this.addToAgenda();
            })
          }
        }
      ]
    });
    addAlert.present();
  }

  /**
   * Ajoute un évènement à l'agenda
   * TODO : récupérer les vraies dates
   */
  addToAgenda() {
    console.log("add to agenda", this.item);
    let alert = this.alertCtrl.create({
      title: this.translate.instant("CALENDAR.SUCCESS.TITLE"),
      subTitle: this.translate.instant("CALENDAR.SUCCESS.MESSAGE"),
      buttons: ['OK']
    });
    this.checkAgendaPermission().then(() => {
      console.log("permission OK");
      let startDateToTransform: any = this.item.DateDebutEvenement;
      let endDateToTransform: any = this.item.DateFinEvenement;
      if (this.platform.is('android')) {
        startDateToTransform += this.item.HeureDebutEvenement != "" ? "T" + this.item.HeureDebutEvenement : "";
        endDateToTransform += this.item.HeureFinEvenement != "" ? "T" + this.item.HeureFinEvenement : "";
      } else {
        startDateToTransform += this.item.HeureDebutEvenement != "" ? "T" + this.item.HeureDebutEvenement + "+02:00" : "";
        endDateToTransform += this.item.HeureFinEvenement != "" ? "T" + this.item.HeureFinEvenement + "+02:00" : "";
      }

      let endDate: any;
      let startDate: any;
      if (startDateToTransform != "" && endDateToTransform != "") { //Les deux dates sont renseignées
        startDate = new Date(startDateToTransform);
        endDate = new Date(endDateToTransform);
      }
      else {//Une seule des deux dates est renseignée (il en faut forcément une)
        //On définit chaque date en fonction de son état
        startDate = startDateToTransform != "" ? new Date(startDateToTransform) : new Date(endDateToTransform);
        endDate = endDateToTransform != "" ? new Date(endDateToTransform) : new Date(startDateToTransform);
      }
      this.calendar.createEventInteractively(this.item.LibTitre, this.item.LibelleLieu.address, null, startDate, endDate).then(result => {
        console.log("createEvent success", result);
      }).catch(error => {
        alert.setTitle(this.translate.instant("CALENDAR.FAIL.TITLE"));
        alert.setSubTitle(this.translate.instant("CALENDAR.FAIL.MESSAGE"));
        alert.present();
        console.log("createEvent error", error);
      });
    }).catch(error => {
      alert.setTitle(this.translate.instant("CALENDAR.FAIL.TITLE"));
      alert.setSubTitle(this.translate.instant("CALENDAR.FAIL.MESSAGE"));
      alert.present();
      console.log("createEvent failed", error);
    });
  }

  /**
   * Vérifie si l'application a le droit d'ajouter un évènement au calendrier
   */
  checkAgendaPermission() {
    return new Promise((resolve, reject) => {
      this.calendar.hasWritePermission().then(result => {
        if (!result) {
          console.log("no permission, asking for it");
          // reject(false);
          //ne fonctionne pas sur iOS ? :
          this.calendar.requestWritePermission().then(result => {
            console.log("requestWritePermission result", result);
            resolve(true);
          }).catch(error => {
            console.log("can't ask for permission, why :", error);
            reject(false);
          });
        }
        else {
          resolve(true);
        }
      });
    });
  }

  popUpActuPrive() {
    const alert = this.alertCtrl.create({
      title: this.translate.instant("NEWS.ALERT.ACTU_PRIVEE_TITLE"),
      subTitle: this.translate.instant("NEWS.ALERT.ACTU_PRIVEE"),
      buttons: ['OK']
    });
    alert.present();
  }


  /**
   * Partage l'actualité ouverte
   */
  shareActu() {
    this.socialSharing.share(
      this.item.LibResume, //message
      this.item.title, //titre
      '',    //fichier(s)
      this.item.LibUrl //url
    );
  }
}