import { Injectable, Inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { Upload } from 'src/app/models/upload.model';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath = '/';
  private uploadTask: firebase.storage.UploadTask;
  uploads: AngularFireObject<any>;
  cacheMetadata = {
    cacheControl: 'public,max-age=2592000'
  };
  constructor(private db: AngularFireDatabase, @Inject(FirebaseApp) public firebaseApp: firebase.app.App) { }
  //Метод загрузки файла в бинарном виде
  pushUpload(upload: Upload) {
    const storageRef = this.firebaseApp.storage().ref();
    this.uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file, this.cacheMetadata);
    console.log(this.uploadTask);
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // загрузка в процессе
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // ошибка при загрузке
        console.warn(error);
      },
      () => {
        // загрузка успешна
        upload.url = this.uploadTask.snapshot.downloadURL;
        console.log(this.uploadTask);
        console.log('URL:' + upload.url);
        upload.name = upload.file.name;
        console.log(upload.name);

        this.saveFileData(upload);
      }
    );
    return this.uploadTask;
  }
  //Метод загрузки файла в base64
  pushUploadBase(base: string, name: string) {
    const storageRef = this.firebaseApp.storage().ref();
    const upload: any = {};
    this.uploadTask = storageRef.child(`${this.basePath}/${name}`).putString(base, 'data_url', this.cacheMetadata);
    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // загрузка в процессе
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        // ошибка при загрузке
        console.warn(error);
      },
      () => {
        // загрузка успешна
        upload.url = this.uploadTask.snapshot.downloadURL;
        upload.name = name;
        this.saveFileData(upload);
      }
    );
    return this.uploadTask;
  }
  // Метод записи данных о загрузке в базу firebase
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }
  //Метод удаления загруженного файла
  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
      .then(() => {
        this.deleteFileStorage(upload.name);
      })
      .catch(error => console.log(error));
  }
  // Удаление данных о загрузке из базы firebase
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }
  // Удаление файла из хранилища firebase
  private deleteFileStorage(name: string) {
    const storageRef = this.firebaseApp.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }


 }

