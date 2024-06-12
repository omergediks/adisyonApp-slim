import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  @Input() duzelt: any;
  @Input() yeniekle: any;

  menu = {
    mainCourses: ['Kebap', 'Pilav', 'Makarna'],
    salads: ['Çoban Salatası', 'Mevsim Salatası'],
    drinks: ['Kola', 'Ayran', 'Su'],
    desserts: ['Baklava', 'Sütlaç']
  };

  selectedMainCourse: string[] = [];
  selectedSalad: string[] = [];
  selectedDrink: string[] = [];
  selectedDessert: string[] = [];

  order = {
    mainCourse: [],
    salad: [],
    drinks: [],
    desserts: [],
    note: ''
  };

  quantities = {
    mainCourse: 1,
    salad: 1,
    drink: 1,
    dessert: 1
  };

  addedItems: string[] = [];

  user = { 'username': '', 'email': '', 'token': '', 'user_id': '', 'name': '' };

  constructor(private restService: RestService, private modalController: ModalController) { }

  ngOnInit() {
    if (this.duzelt) {
      console.log('Önceki Sayfadan Gelen: ', this.duzelt);
    }

    this.restService.checkName().then(veri => {
      this.user = veri;
    }, hata => {
      console.log(hata);
    });
  }

  kapat() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  addItem(category: string) {
    let selectedItems: string[];
    let quantity: number;

    switch (category) {
      case 'mainCourse':
        selectedItems = this.selectedMainCourse;
        quantity = this.quantities.mainCourse;
        break;
      case 'salad':
        selectedItems = this.selectedSalad;
        quantity = this.quantities.salad;
        break;
      case 'drink':
        selectedItems = this.selectedDrink;
        quantity = this.quantities.drink;
        break;
      case 'dessert':
        selectedItems = this.selectedDessert;
        quantity = this.quantities.dessert;
        break;
      default:
        return;
    }

    selectedItems.forEach(item => {
      this.addedItems.push(`${item} x${quantity}`);
      this.order[category].push({ item: item, quantity: quantity });
    });
  }

  submitOrder() {
    let orderSummary = '';

    this.addedItems.forEach(item => {
      orderSummary += item + '\n';
    });

    if (this.order.note) {
      orderSummary += `Not: ${this.order.note}\n`;
    }

    this.yeniekle = {
      feed: orderSummary.trim(),
      user_id: this.user.user_id,
      name: this.user.name,
      email: this.user.email,
      username: this.user.username,
      token: this.user.token
    };

    this.ekle();
  }

  ekle() {
    this.restService.veriGonder('/mesaj_ekle', this.yeniekle).subscribe(
      (sonuc: any) => {
        console.log(sonuc);
        this.restService.mesaj(sonuc.text);
        this.kapat();
      },
      hata => {
        console.log(hata);
      }
    );
  }

  duzenle() {
    let feedData = { 'username': '', 'feed': '', 'token': '' };
    feedData.feed = this.duzelt.feed;
    this.restService.checkName().then(veri => {
      feedData.token = veri.token;
      feedData.username = veri.username;
      this.restService.veriGonder('mesaj/guncelle/' + this.duzelt.feed_id, feedData).subscribe(sonuc => {
        console.log(sonuc);
        this.kapat();
      }, hata => {
        console.log(hata);
      });
    }, hata => {
      console.log(hata);
    });
  }
}
