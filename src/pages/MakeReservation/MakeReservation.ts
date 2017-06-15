import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { DynamoDB, User } from '../../providers/providers';

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
              public user: User,
              public db: DynamoDB) {
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
    
    self.db.getDocumentClient().put({
      'TableName': self.taskTable,
      'Item': this.item,
      'ConditionExpression': 'attribute_not_exists(id)'
    }, function(err, data) {
      if (err) { console.log(err); }
    });
  }
}
