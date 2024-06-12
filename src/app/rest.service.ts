import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AlertController, ToastController } from '@ionic/angular';





@Injectable({
  providedIn: 'root'
})
export class RestService {

  apiUrl = 'http://127.0.0.1:8080/php-slim-rest-master/slimapp/api/';

  constructor(public toastcontroller:ToastController, public alertController:AlertController, public router:Router, private httpClient:HttpClient) { }

veriGetir(endpoint:any)
{
  return this.httpClient.get(this.apiUrl+endpoint);
}

veriGonder(endpoint:any, veri:any)
{
  return this.httpClient.post(this.apiUrl+endpoint, veri);
}

async setName(value:any) {
  await Preferences.set({
    key: 'ionicphprestapi_kullanici',
    value: JSON.stringify(value),
  });
};

async checkName() {
  let deger:any = '';
  deger = await Preferences.get({ key: 'ionicphprestapi_kullanici' });
  const user = JSON.parse(deger.value);
  //console.log(user);
  return user;
};

 async removeName() {
  await Preferences.remove({ key: 'ionicphprestapi_kullanici' });
};

async presentAlert(baslik:any,mesaj:any) {
  const alert = await this.alertController.create({
    header: baslik,
    message: mesaj,
    buttons: ['Tamam'],
  });

  await alert.present();
}

async mesaj(txt:any) {
  const toast = await this.toastcontroller.create({
    message: txt,
    duration:2000,
    position:'bottom',
    color:'dark'
  });
  await toast.present();
}

}
