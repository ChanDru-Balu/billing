import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { DbService } from '../db.service';
import { Purchase } from './purchase';
import { Seller } from '../seller/seller';
import { InvoicePage } from './invoice/invoice.page';
import { PurchaseModalPage } from './purchase-modal/purchase-modal.page';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PurchasePage implements OnInit {

  sellers: Seller[];
  seller: any;
  invoice: any;
  purchases: Purchase[];

  constructor(
    private modalController: ModalController,
    private dbService: DbService,
    private toast: ToastController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.getAllPurchases();

  }

  getAllPurchases() {
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchPurchases().subscribe(async (purchases: Purchase[]) => {
          this.purchases = purchases;
          console.log("Purchases:",this.purchases)
        });
      }
    });
  }

  async presentModal(type, purchase) {
    console.log({type},{purchase});
    
    if (type == "edit") {
      this.dbService.purchaseObj = purchase;
      const modal = await this.modalController.create({
        component: PurchaseModalPage,
        cssClass: 'purchase-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'purchase': purchase
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.getAllPurchases();
        }
      });
      return await modal.present();
    } else if (type == 'view') {
      const modal = await this.modalController.create({
        component: InvoicePage,
        // cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'purchase': purchase
        }
      });
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: PurchaseModalPage,
        // cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'purchase': undefined
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.getAllPurchases();
        }
      });
      return await modal.present();
    }

  }

  async deletePurchase(event, purchase) {
    if (event) {
      event.stopPropagation();
    }
    this.dbService.deletePurchase(purchase.id).then(
      async (res) => {
        const toast = await this.toast.create({
          message: 'Purchase deleted',
          duration: 2500,
        });
        toast.present();
      },
      (error) => console.error(error)
    );
  }


  back(){
    console.log("Back!");
    
    this.navCtrl.pop();
  }

}
