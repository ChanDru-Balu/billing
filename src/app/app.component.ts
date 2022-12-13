import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    if (localStorage.getItem('name') == undefined || localStorage.getItem('name') == null) {
      localStorage.setItem('name', 'sample Name');
      localStorage.setItem('shop', 'sample Shop');
      localStorage.setItem('mobile', '0000000000');
      localStorage.setItem('gst', '0000000000000');
      localStorage.setItem('address', 'sample address');
    }
  }
}
