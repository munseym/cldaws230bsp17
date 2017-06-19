import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, Events } from 'ionic-angular';

import { DynamoDB, User } from '../../providers/providers';

import { Screenshot } from '@ionic-native/screenshot';

declare var AWS: any;

@Component({
  selector: 'page-make-reservation',
  templateUrl: 'MakeReservation.html'
})
export class MakeReservationPage {

  public item: any = {
    'userId': AWS.config.credentials.identityId
  };
  private taskTable: string = 'airlinereservation-mobilehub-779853671-Reservations';

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              private alertCtrl: AlertController,
              public events: Events,
              public user: User,
              public db: DynamoDB,
              private screenshot: Screenshot){
}
  generateId() {
    var len = 16;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLength = chars.length;
    var result = "";
    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
    for(var i = 0; i < len; i++) {
      result += chars[randoms[i] % charLength];
    }
    return result.toLowerCase();
  }

  makeReservation() {
    let id = this.generateId();
    let self = this;

    this.item.userId = AWS.config.credentials.identityId;
    this.item.reservationId = id;
    console.log(JSON.stringify(this.item));    
    self.db.getDocumentClient().put({
      'TableName': self.taskTable,
      'Item': this.item,
      'ConditionExpression': 'attribute_not_exists(id)'
    }, function(err, data) {
      if (err) { console.log(err); }
    });

    self.screenshot.URI(80).then(this.onSuccess, this.onError);  
    this.events.publish('reservation:created', Date.now());
  }

  onSuccess(success){
    this.selectedPhoto  = this.dataURItoBlob('data:image/jpeg;base64,' + success);
    this.upload();
  }
  
  onError(err){
    alert(JSON.stringify(err));  
  }
  
  dataURItoBlob(dataURI) {
    // code adapted from: http://stackoverflow.com/questions/33486352/cant-upload-image-to-aws-s3-from-ionic-camera
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  };
  
  upload() {
    let self = this;
    if (self.selectedPhoto) {
      this.s3.upload({
        'Key': 'protected/' + self.sub + '/avatar',
        'Body': self.selectedPhoto,
        'ContentType': 'image/jpeg'
      }).promise().then((data) => {
        alert('upload complete:', data);
      }).catch((err) => {
        alert('upload failed....', err);
      });
    }
  }  

  presentConfirm() {
    let self = this;
    let alert = this.alertCtrl.create({
      title: 'Confirm reservation',
      message: 'Do you want to confirm this reservation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            self.makeReservation();
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
