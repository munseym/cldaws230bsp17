import { Component } from '@angular/core';

import { SettingsPage } from '../settings/settings';
import { MakeReservationPage } from '../MakeReservation/MakeReservation';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = MakeReservationPage;
  tab2Root = SettingsPage;

  constructor() {

  }
}
