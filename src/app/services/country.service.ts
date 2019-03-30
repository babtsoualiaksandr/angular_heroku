import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  public formData: Country;  

  constructor(private firestore: AngularFirestore) { }

  get() {  
    console.log("get");  
    return this.firestore.collection('country').snapshotChanges();  
    console.log("get next");
    
  }

  create(item: Country) {
    return this.firestore.collection('country').add(item);
  }
  update(item: Country) {
    delete item.id;
    this.firestore.doc('country/' + item.id).update(item);
  }
  delete(itemId: string) {
    this.firestore.doc('country/' + itemId).delete();
  }
}
