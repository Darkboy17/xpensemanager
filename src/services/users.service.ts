import {Injectable} from '@angular/core';
import { Http } from '@angular/http';
import firebase from 'firebase';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {   
    public fireAuth: any;
    public currentUser: any;
    public userProfile :any;
   
    constructor(private http: Http) {    
  
        this.fireAuth = firebase.auth();
        
        
    }

    signUpUser(name:string, email: string, password: string) {
        return this.fireAuth.createUserWithEmailAndPassword(email, password)
        .then((newUser) => {
            //sign-in the user
            this.fireAuth.signInWithEmailAndPassword(email,password)
            .then((authenticatedUser) => {
                //If Login is successful, create User Profile
                this.currentUser = firebase.auth().currentUser.uid;
                this.userProfile = firebase.database().ref('userProfile/'+this.currentUser + '/userCreds/');
                this.userProfile.child(authenticatedUser.uid).set({
                    name: name,
                    email: email
                });
            });
        });
    };

    //auth-data sign-up function
    signup(email: string, password: string): firebase.Promise<any> {
        return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
            firebase.database().ref('/userProfile').child(newUser.uid).set({
                email: email
             });
        });
    }

    viewUser(userId: any){
			var userRef = this.userProfile.child(userId);
			return userRef.once('value'); 
}

    login(email: string, password: string): firebase.Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
    
  }

    loginUser(email: string, password: string) {
        return this.fireAuth.signInWithEmailAndPassword(email, password);
    }

    resetPassword(email: string): firebase.Promise<any> {
     return firebase.auth().sendPasswordResetEmail(email);
    }

    logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }
}