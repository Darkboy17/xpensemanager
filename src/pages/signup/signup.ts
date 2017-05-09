import { 
  NavController, 
  LoadingController, 
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { EmailValidator } from '../../validators/email';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [UsersService]
})
export class SignupPage {
  public signupForm;
  loading: any;


  constructor(public nav: NavController, public userService: UsersService, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController) {

    this.signupForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  presentAlert():any {
  let alert = this.alertCtrl.create({
    title: 'Succesfully Registered',
    subTitle: 'Congratulations!,You are now a registered member of this app.',
    buttons: [
      {
        text: "Cool.",
        handler: () => {
          console.log('Yes clicked');
          this.nav.setRoot(TabsPage);
        }
      }
    ]
  });
  alert.present();
}
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.userService.signUpUser(this.signupForm.value.name,this.signupForm.value.email, this.signupForm.value.password)
      .then(() => {
        this.loading.dismiss().then( () => {
          this.presentAlert();          
        });
      }, (error) => {
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
      this.loading = this.loadingCtrl.create({
        content: 'You are being registered...Please be cool',
      });
      this.loading.present();
    }
  }
}