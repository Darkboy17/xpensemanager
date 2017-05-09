import { Component } from '@angular/core';

import { ViewController, NavController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import { AgeValidator } from '../../validators/age';


@Component({
  selector: 'validate',
  templateUrl: 'validate.html', 
})
export class ValidatePage {
  public addSongForm: any;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {
    this.addSongForm = formBuilder.group({
      songName: ['', Validators.compose([Validators.required, 
        Validators.minLength(2)])],
      artistName: ['', Validators.compose([Validators.required, 
        Validators.minLength(2)])],
      userAge: ['', Validators.compose([Validators.required, AgeValidator.isValid])]
    });
  }
}
