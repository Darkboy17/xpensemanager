import { Component } from '@angular/core';

import {ViewController,NavController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { HomePage } from '../home/home';

import { ItemData } from '../../services/items.service';

import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';


import { EmailValidator } from '../../validators/email';

import firebase from 'firebase';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html', 
})
export class AboutPage {
  
  item_name:any;
  quantity: any;
  unit: any;
  quantity_settings: any;
  category: any;
  price: any;
  itemDate: any;
  items: FirebaseListObservable<any>;
  itemer: any;
  itemForm: FormGroup;
  public itemList: any;
  public qtyList: any;
  public currentUser: string;
  public isenabled:boolean=false;
  categ: any;
  units: any;
  constructor(public formBuilder: FormBuilder,public loadingCtrl: LoadingController, public navCtrl: NavController, public angFire: AngularFire, private viewCtrl: ViewController, public itemData: ItemData) {
      this.itemForm = formBuilder.group({
      itemname: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      qty:  ['', Validators.compose([Validators.required])],
      unit:  ['', Validators.compose([Validators.required])],
      price:  ['', Validators.compose([Validators.required])],
      category:  ['', Validators.compose([Validators.required])],
      date: ['', Validators.compose([Validators.required])]
    });  
       this.currentUser = firebase.auth().currentUser.uid;
       let loader = this.loadingCtrl.create({
      content: "Fetching Required Data...",    
    });
    loader.present().then(() =>{
        this.getQty();
        this.getCateg();
        this.getUnit();       
    }).then(() => {
      loader.dismiss();
    });        
       
  }
   toggleSave(){
      if(this.item_name && this.category && this.price && this.unit && this.itemDate ){
        //enable the button
        this.isenabled=true;       
      }else
      {
          //disable the button
          this.isenabled=false;
      }
   
    }
  clearform() {
         this.itemForm.reset();
  } 

  getCateg(): any {  
     let categ = [];         
     this.itemList= this.angFire.database.list('/Categories/');
      this.itemList.subscribe(items =>{
         items.map(items =>categ.push({name: items.category}))
        
        categ = this.uniq(categ);
         //console.log(categ);     
        
      });
       this.categ = categ;
      // console.log("Unique Category : ", categ);
  }
  uniq(a) {
    var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

    return a.filter(function(item) {
        var type = typeof item;
        if(type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
  }
   getUnit(): any {  
     let fetch_unit = [];         
     this.itemList=this.angFire.database.list('/Units/');
      this.itemList.subscribe(items =>{
         items.map(item =>fetch_unit.push({name: item.unit}))
        
        fetch_unit = this.uniq(fetch_unit);
       //  console.log(fetch_categ);     
        
      });
       this.units = fetch_unit;
      // console.log("Unique Units : ", this.units);
  }

  getQty(): any {  
     let fetch_quantity = [];  
     let range = [];         
     this.qtyList=this.angFire.database.list('/Quantity/');
      this.qtyList.subscribe(items =>{
         items.map(item =>fetch_quantity.push({range: item.quantity_range}))
        
       // fetch_quantity = this.uniq(fetch_quantity);
       //  console.log(fetch_categ);  
       for(var i=1; i<=fetch_quantity[0].range;i++){
         range.push(i);
       }   
        
      });     
       
       this.quantity_settings = range;
      // console.log("Unique Quantity Settings : ", this.quantity_settings);
  }
  ionViewDidEnter(){
   let loader = this.loadingCtrl.create({
      content: "Fetching Required Data...",    
    });
    loader.present().then(() =>{
        this.getQty();
        this.getCateg();
        this.getUnit();       
    }).then(() => {
      loader.dismiss();
    });    
  }
  

  createItem(item_name: string, category: string, quantity: number, price: number, unit: string, itemDate: string) {
    let loader = this.loadingCtrl.create({
      content: "Adding New Item...",
     // duration: 3000
    });
    loader.present().then(() => {       
      this.itemData.createItem(item_name, category, quantity, price, unit, itemDate).then(() => {
        this.clearform();
      loader.dismiss();       
     // this.navCtrl.setRoot(TabsPage);  
       // this.navCtrl.pop(TabsPage);
          
    })
           
   });  
    
  } 
  
}
