import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-anasayfa',
  templateUrl: './anasayfa.page.html',
  styleUrls: ['./anasayfa.page.scss'],
})
export class AnasayfaPage implements OnInit {
  mesajlar: any;
  kullanici: any;

  constructor(public modalController: ModalController, public restService: RestService) { }

  async ngOnInit() {
    this.listele();
  }

  async listele() {
    let user = await this.restService.checkName();
    if (user == null) {
      this.modalController.dismiss();
      this.restService.router.navigateByUrl('/home');
    } else {
      this.restService.veriGetir('mesajlar/' + user.user_id).subscribe(
        sonuc => {
          this.mesajlar = sonuc;
        },
        hata => {
          console.log(hata);
        }
      );
    }
  }

  async cikis_mesaj(baslik: any, mesaj: any) {
    const alert = await this.restService.alertController.create({
      header: baslik,
      message: mesaj,
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Tamam',
          role: 'confirm',
          handler: () => {
            this.cikis();
          },
        },
      ]
    });
    await alert.present();
  }

  cikis() {
    this.restService.removeName();
    this.restService.router.navigateByUrl('/home');
  }

  zamanDonustur(zaman: number) {
    const date = new Date(zaman * 1000);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
  }
  
  async duzenle(mesaj: any) {
    let user = await this.restService.checkName();
    if (user == null) {
      this.modalController.dismiss();
      this.restService.router.navigateByUrl('/home');
    } else {
      console.log(user);
      const modal = await this.modalController.create({
        component: ModalPage,
        componentProps: {
          'duzelt': mesaj
        }
      });
      const slidingItem = document.getElementById('slidingItem' + mesaj.feed_id) as HTMLIonItemSlidingElement
      slidingItem.close();
      return await modal.present();
    }
  }

  async silOnay(id: any) {
    let user = await this.restService.checkName();
    if (user == null) {
      this.restService.router.navigateByUrl('/home');
    } else {
      const alert = await this.restService.alertController.create({
        header: 'Uyarı',
        message: 'Mesajı Silmek İstiyor musunuz?',
        buttons: [
          {
            text: 'Vazgeç',
            role: 'cancel',
            handler: () => {
              const slidingItem = document.getElementById('slidingItem' + id) as HTMLIonItemSlidingElement
              slidingItem.close();
            },
          },
          {
            text: 'Tamam',
            role: 'confirm',
            handler: () => {
              const slidingItem = document.getElementById('slidingItem' + id) as HTMLIonItemSlidingElement
              slidingItem.close();
              this.restService.veriGonder('sil/' + id, user).subscribe(
                (sonuc: any) => {
                  this.restService.mesaj(sonuc.text);
                  this.listele();
                },
                hata => {
                  console.log(hata);
                }
              )
            },
          },
        ]
      });
      await alert.present();
    }
  }

  async ekle() {
    let user = await this.restService.checkName();
    if (user == null) {
      this.modalController.dismiss();
      this.restService.router.navigateByUrl('/home');
    } else {
      console.log(user);
      const modal = await this.modalController.create({
        component: ModalPage,
        componentProps: {
          'yeniekle': user
        }
      });
      return await modal.present();
    }
    this.handleRefresh(event);
  }

  handleRefresh(event) {
    setTimeout(() => {
      this.listele();
      event.target.complete();
    }, 1000);
  }
}
