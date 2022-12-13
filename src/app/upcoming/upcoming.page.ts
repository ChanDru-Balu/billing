import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.page.html',
  styleUrls: ['./upcoming.page.scss'],
})
export class UpcomingPage implements OnInit {

  constructor(
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  back(){
    this.navController.pop();
  }

}
