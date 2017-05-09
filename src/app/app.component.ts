import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { TempPage } from '../pages/temp/temp';

//import { DataService } from '../providers/data.service';

import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TempPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    //data.init();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      
      //statusBar.styleDefault();
     // splashScreen.hide();
    });
  }
}
