import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators  } from '@angular/forms';


import firebase from 'firebase';

import { RangeValidator } from '../../validators/range';

@Component({
  selector: 'page-contact',
  templateUrl: 'settings.html'
})
export class SettingsPage {
    
    public settingForm;
    public quant_sett;
    public categ_name:string;
    public unit_name:string;
    public isenabled:boolean=false;
    public categList: firebase.database.Reference;
    public quantList: firebase.database.Reference;
    public unitList: firebase.database.Reference;
    showCateg : boolean = false;
     public buttonClicked: boolean = false;
     minqty:any = 1;
     maxqty:any = 500;
    constructor(public formBuilder: FormBuilder,public navCtrl: NavController, public loadingCtrl: LoadingController) {
        this.settingForm = formBuilder.group({
        categName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        unitName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        qtyRng: ['', Validators.compose([Validators.required, RangeValidator.isValid])]
       
             
    });
   
  }

  clearform() {
         this.settingForm.reset();
    }
  toggleSave(){
      if(this.categ_name || this.unit_name || (this.quant_sett>0 && this.quant_sett<=500)){
        //enable the button
        this.isenabled=true; 
      
      }else
      {
          //disable the button
          this.isenabled=false;
      }
   
    }
  saveSettings(category: string, unit: string, quant_range: number) {
    
    this.unitList = firebase.database().ref('/Units/');
    this.categList = firebase.database().ref('/Categories/');
    this.quantList = firebase.database().ref('/Quantity/');
    let loader = this.loadingCtrl.create({
      content: "Saving Settings...",
     // duration: 3000
    });
    loader.present().then(() => {
      if(category){
        this.categList.push({      
            category: category    
        });
      }
       if(unit)    {
           this.unitList.push({      
            unit: unit    
        }); 
       }
       if(quant_range)    {
         this.quantList.remove(); 
           this.quantList.push({      
            quantity_range: quant_range    
        }); 
       }  
        
                
   }).then(() =>{
        this.clearform();
        loader.dismiss();
   })  
    
  }

}