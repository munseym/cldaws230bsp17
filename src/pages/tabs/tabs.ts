import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { MakeReservationPage } from '../MakeReservation/MakeReservation';
import { ViewReservationsPage } from '../ViewReservations/ViewReservations';
import { ViewTicketsPage } from '../ViewTickets/ViewTickets';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MakeReservationPage;
  tab2Root = ViewReservationsPage;
  tab3Root = ViewTicketsPage;
  tab4Root = SettingsPage;

  constructor() {

  }
}
