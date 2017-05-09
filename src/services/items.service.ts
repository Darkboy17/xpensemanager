import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class ItemData {
  public currentUser: string;
  public itemList: firebase.database.Reference;
  public categList: firebase.database.Reference;
  private itemsNode: any;
  private fireRef: any;
  //public profilePictureRef: firebase.storage.Reference;

  constructor() {
    this.currentUser = firebase.auth().currentUser.uid;
    this.itemList = firebase.database().ref(`userProfile/${this.currentUser}/Items`);
   
  //this.profilePictureRef = firebase.storage().ref('/guestProfile/');
    this.itemsNode = firebase.database().ref(`userProfile/${this.currentUser}/Items`);
    this.fireRef = firebase.database().ref();

  }

  listItemService(): firebase.database.Reference{
			return this.itemsNode.once('value'); 
}

createItemService(userId: any, item_name: string, category: string, quantity: number, 
    price: number, unit: string, itemDate: string){
  	 // A post entry.
        var itemData = {
            uid: userId,
            item_name: item_name,
            quantity: quantity,
            price: price,
            category: category,
            unit: unit
        };

        // Get a key for a new Post.
        var newPostKey = this.itemsNode.push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updatePath = {};
        //updatePath['/posts/' + newPostKey] = postData;
        updatePath['/user-items/' +userId+"/"+ newPostKey] = itemData;
        
      //update both tables simultaneously
        return this.fireRef.update(updatePath);
  
}
  getItemList(): firebase.database.Reference {
    return this.itemList;
  }

  getitemDetail(itemId): firebase.database.Reference {
    return this.itemList.child(itemId);
  }

  createItem(item_name: string, category: string, quantity: number, 
    price: number, unit: string, itemDate: string): firebase.Promise<any> {    
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    var d = new Date(itemDate);
    var selected_month = d.getMonth();
    this.itemList = firebase.database().ref('userProfile/'+ this.currentUser + '/Items/' + monthNames[selected_month]);
    
    return this.itemList.push({
      item_name: item_name,
      quantity: quantity,
      price: price,
      category: category,
      unit: unit,
      date: itemDate,
      month: monthNames[selected_month]
    });
  }  

  /*addGuest(guestName, eventId, eventPrice, guestPicture = null): firebase.Promise<any> {
    return this.eventList.child(eventId).child('guestList').push({
      guestName: guestName
    }).then((newGuest) => {
      this.eventList.child(eventId).transaction( (event) => {
        event.revenue += eventPrice;
        return event;
      });
      if (guestPicture != null) {
        this.profilePictureRef.child(newGuest.key).child('profilePicture.png')
      .putString(guestPicture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.eventList.child(eventId).child('guestList').child(newGuest.key).child('profilePicture')
          .set(savedPicture.downloadURL);
        });        
      }
    });
  }*/

}
