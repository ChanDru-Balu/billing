import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { DbService } from '../db.service';
import { Sales } from './sales';
import { Customer } from '../customer/customer';
import { PurchaseModalPage } from '../purchase/purchase-modal/purchase-modal.page';
import { InvoicePage } from '../purchase/invoice/invoice.page';
import { SalesModalPage } from './sales-modal/sales-modal.page';
import { SalesInvoicePage } from './sales-invoice/sales-invoice.page';
// import { InvoicePage } from './invoice/invoice.page';
// import { PurchaseModalPage } from './purchase-modal/purchase-modal.page';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {

  customers: Customer[];
  seller: any;
  invoice: any;
  saleses: Sales[];

  constructor(
    private modalController: ModalController,
    private dbService: DbService,
    private toast: ToastController,
    private navController: NavController
  ) { 
    this.getAllSales();
  }

  ngOnInit() {
    
  }

  getAllSales() {
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchSaleses().subscribe(async (saleses: Sales[]) => {
          this.saleses = saleses;
          console.log("Sales:",this.saleses);
        });
      }
    });
  }

  async presentModal(type, sales) {
    console.log({type},{sales});
    
    if (type == "edit") {
      this.dbService.salesObj = sales;
      const modal = await this.modalController.create({
        component: SalesModalPage,
        // cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'salesExist': sales
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.getAllSales();
        }
      });
      return await modal.present();
    } else if (type == 'view') {

      const modal = await this.modalController.create({
        component: SalesInvoicePage,
        // cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'sales': sales
        }
      });
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: SalesModalPage,
        // cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'sales': undefined
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.getAllSales();
        }
      });
      return await modal.present();
    }

  }

  async deleteSales(event, sales) {
    if (event) {
      event.stopPropagation();
    }
    this.dbService.deleteSales(sales.id).then(
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
    this.navController.pop();
  }

}
