import { Component } from '@angular/core';

import { NavController, AlertController} from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import 'rxjs/Rx';

import { LoadingController } from 'ionic-angular';

import { UsersService } from '../../services/users.service';

import { TempPage } from '../temp/temp';

import { ItemData } from '../../services/items.service';

import {Injectable} from '@angular/core';

import firebase from 'firebase';

import { FormBuilder} from '@angular/forms';

import { Http }  from "@angular/http";

import { ListData } from '../../providers/list-data';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UsersService,ItemData]
})
@Injectable()
export class HomePage {
  
  itemsLists:any;
  username:Array<any>;
  pickedCategList = [];
  skipValue: number = 0; 
  private userProfileLists: any;
  private userId: any;
  selectedCat: any;
  selectedMonth: any;
  public itemList: any;
  total: Number;
  category: Array<any>;
  months: Array<any>;
  items: FirebaseListObservable <any>;
  public currentUser: string;
  public addSongForm : any;
  lastUpdated: any;
  a = 3;
  numbeOfItems: any;
  public active: number = 1;

constructor(public http: Http, public listData: ListData, public formBuilder: FormBuilder, public itemData: ItemData, public navCtrl: NavController, private usersService: UsersService,  public alertCtrl: AlertController, private angFire: AngularFire,public loadingCtrl: LoadingController) {
      
      this.currentUser = firebase.auth().currentUser.uid;
      this.lastUpdated = new Date();
      this.userProfileLists = firebase.database().ref('users');
      this.userId = firebase.auth().currentUser.uid;
      this.selectedCat = "All";
      var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
      var d = new Date();
      var curr_month = d.getMonth();   
      this.selectedMonth = monthNames[curr_month];
      this.curr_month_noOfItems();
      this.getUserName();
      this.getCateg(this.selectedMonth);
      this.getMonths(); 
 
      let loader = this.loadingCtrl.create({
        content: "Loading Items from Cloud...",
        spinner: 'dots'    
      });
      loader.present().then(() =>{
        this.fetchItems(this.a);       
      }).then(() => {
        loader.dismiss();
      });
}
curr_month_noOfItems() {
    this.angFire.database.list('userProfile/'+this.currentUser + '/Items/' + this.selectedMonth+'/').subscribe((res) => {
       this.numbeOfItems = res.length;
      //  console.log('Number of Items on '+ this.selectedMonth +' is', this.numbeOfItems);
      });
     
  }

doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    if(this.itemsLists.length == this.numbeOfItems) {
             refresher.complete();
        }else {          
          this.a+=3;
          //console.log('Begin async operation');
              setTimeout(() => {
                this.fetchItems(this.a);
                   refresher.complete();              
                //console.log('Async operation has ended');
             
              }, 3000);              
        }     

  }

pickCateg(categ: string, month: string){
  let loader = this.loadingCtrl.create({
        content: "Filtering Items by Category...",
        spinner: 'dots'    
      });
      loader.present().then(() =>{
        this.curr_month_noOfItems();
        let sum =0; 
        this.listData.getListByCategory(categ, month, this.a).subscribe(data => {
          // console.log('Categorised Data : ', data);      
          this.itemsLists = data;
          this.numbeOfItems = this.itemsLists.length
          data.forEach(item => {  
            sum = sum + parseFloat(item.price);                              
          });
          // console.log('Price in Categorised Data : ', sum); 
          // console.log('Selected category : ', categ);
          // console.log('Selected month : ', month);
          this.total = sum;
        });     
            
      }).then(() => {
        loader.dismiss();
      });
 
}

pickMonth(month: string, categ: string){
    let loader = this.loadingCtrl.create({
        content: "Filtering Items by Month...",
        spinner: 'dots'    
      });
      loader.present().then(() =>{
        this.curr_month_noOfItems();
        let sum =0;  
        this.listData.getListByMonth(month, categ, this.a).subscribe(data => {
          //console.log('Month : ', data);  
          this.itemsLists = data;
          this.numbeOfItems = this.itemsLists.length
          data.forEach(item => {  
              sum = sum + parseFloat(item.price);                              
          });
          // console.log('Price in pickMonth() : ', sum); 
          this.total = sum;   
        }); 
        this.getCateg(this.selectedMonth);       
      }).then(() => {
        loader.dismiss();
      });    
      
}
 fetchItems(noOfItemstoLoad) {
   return new Promise((resolve) => {
      this.listData.getlimitedcategoryList(noOfItemstoLoad, this.selectedMonth).on('value', snapshot => {
      let rawList10 = [];
      let sum = 0;
      snapshot.forEach(snap => {
        rawList10.unshift({
          id: snap.key,
          item_name: snap.val().item_name,
          price: snap.val().price,
          quantity: snap.val().quantity,
          unit: snap.val().unit,
          category: snap.val().category
        });
          sum = sum + parseFloat(snap.val().price)
      });
      this.itemsLists = rawList10;
      resolve(true);
     // console.log("itemsLists from fetchItems(): ",  this.itemsLists);      
      this.total = sum;
    });
   })   
   
} 
getUserName(){
   let categ = [];       
     this.itemList=this.angFire.database.list('userProfile/'+this.currentUser+'/userCreds/');
      this.itemList.subscribe(items =>{
       
         items.map(items =>categ.push({name:items.name}))        
        categ = this.uniq(categ);             
        
      });
       this.username = categ;
      //console.log("UserName : ",this.username);  
}

doInfinite(infiniteScroll) {   
    if(this.itemsLists.length == this.numbeOfItems) {
             infiniteScroll.enable(false);
        }else {          
          this.a+=3;
          console.log('Begin async operation');
              setTimeout(() => {
                this.loadMoreItems(this.a);
                  infiniteScroll.complete();      
              
                //console.log('Async operation has ended');
             
              }, 4000);
              
        }      
  }

loadMoreItems(noOfItemstoLoad):any{
    this.fetchItems(noOfItemstoLoad);
}

ionViewDidLoad(){ 
  
    
}

logOutdialog(){
  let alert = this.alertCtrl.create({
    title: 'Logout Confirmation',
    message: 'Hey Buddy, Are you sure you want to log out?',
    buttons: [
      {
        text: "I'll stay",
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      },
      {
        text: "Yes,I'm Sure",
        handler: () => {
          //console.log('Yes clicked');
          this.logout();
        }
      }
    ]
  });
  alert.present();
}
logout() {
 
  let loader = this.loadingCtrl.create({
            content : "Logging Out...Please Wait",
            //dismissOnPageChange: true,           
          });
          loader.present().then(() => {
            this.usersService.logoutUser().then(() => {
            setTimeout(() => {
              loader.dismiss();
              //this.navCtrl.remove(0);
              let rootNav = this.getRootNav(this.navCtrl);
              rootNav.setRoot(TempPage);
              //this.navCtrl.setRoot(TempPage);
           }, 1500);
         });
   });
  
}

getRootNav(nav: NavController) : NavController {
    let root = nav;
    while(root.parent != null){
        root = root.parent;
    }
    return root;
}
  getCateg(month: string): any {  
     let categ = [];
     let temp = [];         
     this.itemList=this.angFire.database.list('userProfile/'+this.currentUser+'/Items/' + month);
      this.itemList.subscribe(items =>{
         items.map(items =>categ.push({name: items.category}))
      
        categ = this.squash(categ);
        //console.log(categ); 
        for (var i in categ){
          temp.push(categ[i].name);
        }
        this.category = this.squash(temp);
        //console.log("Unique Category : ",this.category);
      });    
}
  squash(arr){
    var tmp = [];
    for(var i = 0; i < arr.length; i++){
        if(tmp.indexOf(arr[i]) == -1){
        tmp.push(arr[i]);
        }
    }
    return tmp;
}
  getMonths(): any { 
    let month = [];
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    var d = new Date();
    var curr_month = d.getMonth();   
    for(var i=0;i<=curr_month; i++){
      month.push(monthNames[i]);
    }             
    
       this.months = month;
      // console.log("Unique Month : ", this.months);
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
  
}


