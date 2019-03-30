import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {
  list: Country[];
  

  constructor(private service: CountryService, 
    private firestore: AngularFirestore,
    private toastr: ToastrService) {
  }
  ngOnInit() {
    console.log("----");
    this.service.get().subscribe(data => {
      console.log("----@@@@@");
      this.list = data.map(e => {
        console.log("------------");
        return {          
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Country;
      })
    });

    




  }

  onEdit(emp: Country) {
    this.service.formData = Object.assign({}, emp);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this record?")) {
      this.firestore.doc('country/' + id).delete();
      this.toastr.warning('Deleted successfully','Oyyy');
    }
  }

  
  create(country: string){
    console.log(country);
    const dataCountry = { id:'', name: country}
       
    this.service.create(dataCountry);
}

update(country: Country) {
  this.service.update(country);
}

delete(id: string) {
  console.log(id);
  this.service.delete(id);
}

}
