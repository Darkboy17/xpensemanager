import {Injectable} from '@angular/core';
// if you've gone with the local installation approach, you'd use the following:
import firebase from 'firebase';

@Injectable()
export class DataService {
    public db: any;
    constructor() {}

    init() {
        const firebaseConfig = {
            apiKey: "AIzaSyAQEVOdSTzWsow-LwJdpudKJA0Bp2vVpp0",
            authDomain: "my-booklist-e0278.firebaseapp.com",
            databaseURL: "https://my-booklist-e0278.firebaseio.com",
            storageBucket: "my-booklist-e0278.appspot.com",
            messagingSenderId: "750056751776"
        }

        firebase.initializeApp(firebaseConfig);

        this.db = firebase.database().ref('/');
    }
}