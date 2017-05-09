import { Injectable } from '@angular/core';
import firebase from 'firebase';
import 'rxjs/add/operator/map';
import { AngularFire } from 'angularfire2';


/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListData {

  public currentUser: string;

  constructor(public af: AngularFire) {
   
  }

  getPaginatedList(skipValue: number = 5): Promise<any> {
    
    return new Promise ((resolve, reject) => {
        this.currentUser = firebase.auth().currentUser.uid;
        let itemList: Array<any> = [];   
        const listRef = firebase.database().ref('userProfile/'+this.currentUser+'/Items').orderByKey()
        .startAt(null);
        listRef.once('value', snapshot => {
          snapshot.forEach( childSnapshot => {
            itemList.push(childSnapshot.val());
            return false;
          });
        });
        resolve(itemList);
        console.log('itemlist:',itemList);
    });
  }


  getlimitedcategoryList(number, month): any {
    this.currentUser = firebase.auth().currentUser.uid;   
    return firebase.database().ref('userProfile/'+ this.currentUser + '/Items/' + month).limitToFirst(number);
  }
  getUserName(): any {
    this.currentUser = firebase.auth().currentUser.uid;   
    return firebase.database().ref('userProfile/'+ this.currentUser);
  }
  getListByCategory(categ, month, number) {
    this.currentUser = firebase.auth().currentUser.uid;
    if(categ == "All") {
      return this.af.database.list('userProfile/'+this.currentUser+'/Items/'+ month,{
        query: {
          limitToFirst: number      
      }
      });          
    }else{
      return this.af.database.list('userProfile/'+this.currentUser+'/Items/'+ month, {
      query: {
        limitToFirst: number,
        orderByChild: 'category',
        equalTo: categ
      }
    });    
    }
  }

  getListByMonth(month, categ, number) {
    
    this.currentUser = firebase.auth().currentUser.uid;
    if(categ == "All") {
      return this.af.database.list('userProfile/'+this.currentUser+'/Items/'+ month,{
        query: {
        limitToFirst: number
      }
      });          
    }else{
      return this.af.database.list('userProfile/'+this.currentUser+'/Items/'+ month, {
      query: {
        limitToFirst: number,
        orderByChild: 'category',
        equalTo: categ
      }
    });    
    }
  }
}
