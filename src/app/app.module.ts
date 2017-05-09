import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//Pages
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';
import { ValidatePage } from '../pages/validate/validate';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { TempPage } from '../pages/temp/temp';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';


//Provider
//import { AuthData } from '../providers/auth-data';
import { ItemData } from '../services/items.service';
import { FirebaseData } from '../providers/firebase-data';
import { ListData } from '../providers/list-data';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule} from 'angularfire2';

import * as firebase from 'firebase';

export const firebaseConfig = {
    apiKey: "AIzaSyAQEVOdSTzWsow-LwJdpudKJA0Bp2vVpp0",
    authDomain: "my-booklist-e0278.firebaseapp.com",
    databaseURL: "https://my-booklist-e0278.firebaseio.com",
    storageBucket: "my-booklist-e0278.appspot.com",
    messagingSenderId: "750056751776"
}

//const myFirebaseAuthConfig = {
 // provider: AuthProviders.Password,
 // method: AuthMethods.Password
//}
firebase.initializeApp(firebaseConfig); //<-- where the magic happens

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SettingsPage,
    ValidatePage,
    ContactPage,
    HomePage,
    TabsPage,
    TempPage,
    SignupPage,
    ResetPasswordPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)//,myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    TempPage,
    SignupPage,
    ResetPasswordPage,
    SettingsPage,
    ValidatePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ItemData,FirebaseData,ListData
  ]
})
export class AppModule {}
