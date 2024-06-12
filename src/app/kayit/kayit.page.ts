import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-kayit',
  templateUrl: './kayit.page.html',
  styleUrls: ['./kayit.page.scss'],
})
export class KayitPage implements OnInit {

  userData = {
    'name':'',
    'email':'',
    'username':'',
    'password':'',
  };

 constructor(private restService:RestService) {

  }
  ngOnInit() {
  }

  kayit()
  {
    this.restService.veriGonder('kayit',this.userData).subscribe(
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
