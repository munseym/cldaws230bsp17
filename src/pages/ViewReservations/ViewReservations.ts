import { Component } from '@angular/core';

import { NavController, ModalController, Events } from 'ionic-angular';

import { DynamoDB, User } from '../../providers/providers';

declare var AWS: any;

@Component({
  selector: 'page-view-reservations',
  templateUrl: 'ViewReservations.html'
})
export class ViewReservationsPage {

  public items: any;
  public refresher: any;
  private taskTable: string = 'airlinereservation-mobilehub-779853671-Reservations';

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public events: Events,
              public user: User,
              public db: DynamoDB) {
                
    this.events.subscribe('reservation:created', (time) => {
      this.refreshReservations();
    });

    this.refreshReservations();
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshReservations()
  }

  refreshReservations() {
    var self = this;
    this.db.getDocumentClient().query({
      'TableName': self.taskTable,
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': {
        '#userId': 'userId',
      },
      'ExpressionAttributeValues': {
        //':userId': self.user.getUser().getUsername(),
        ':userId': AWS.config.credentials.identityId
      },
      'ScanIndexForward': false
    }).promise().then((data) => {
      this.items = data.Items;
      if (this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  deleteTask(item, index) {
    let self = this;
    this.db.getDocumentClient().delete({
      'TableName': self.taskTable,
      'Key': {
        'userId': AWS.config.credentials.identityId,
        'reservationId': item.reservationId
      }
    }).promise().then((data) => {
      this.items.splice(index, 1);
    }).catch((err) => {
      console.log('there was an error', err);
    });
  }

}
