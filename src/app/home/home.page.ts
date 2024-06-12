import { Component } from '@angular/core';
import { RestService } from '../rest.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  

  userData = {
    'username':'',
    'password':'',
  };

  constructor(private restService:RestService) {

  }



  giris()
  {
    this.restService.veriGonder('giris',this.userData).subscribe(
      sonuc=>{
        //this.mesajlar= sonuc;
        console.log(sonuc);
        this.restService.setName(sonuc);
        this.restService.router.navigateByUrl('/anasayfa');
      },
      hata=>{
        this.restService.presentAlert('Hata', hata.error.error.text);
        console.log(hata.error.error.text);
      }
    );
  }

}
