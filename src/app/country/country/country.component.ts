import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/country.model';
import { CountryService } from 'src/app/services/country.service';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from 'src/app/services/uploads/upload.service';
import { Upload } from 'src/app/models/upload.model';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
  formData: Country;
  selectedFiles: FileList;
  currentUpload: Upload;

  constructor(public service: CountryService,
    private firestore: AngularFirestore,
    private toastr: ToastrService,
    private upSvc: UploadService) {

  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    console.log(this.currentUpload);
    this.upSvc.pushUpload(this.currentUpload);
  }

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    console.log(form);
    if (form != null)
      form.resetForm();
    this.service.formData = {
      id: null,
      name: ''
    }
  }

  onSubmit(form: NgForm) {
    let data = Object.assign({}, form.value);
    delete data.id;
    if (form.value.id == null)
      this.firestore.collection('country').add(data);
    else
      this.firestore.doc('country/' + form.value.id).update(data);
    this.resetForm(form);
    this.toastr.success('Submitted successfully', 'EMP. Register');
  }

}
