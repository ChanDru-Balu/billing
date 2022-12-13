import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DbService } from '../db.service';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { Customer } from '../customer/customer';
import { Seller } from './seller';
import { SellerModalPage } from './seller-modal/seller-modal.page';
// import { CustomerModalPage } from './customer-modal/customer-modal.page';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.page.html',
  styleUrls: ['./seller.page.scss'],
})
export class SellerPage implements OnInit {

  sellers: Seller[];
  seller: string;

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private toast: ToastController,
    private modalController: ModalController,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchSellers().subscribe(async (sellers: Seller[]) => {
          this.sellers = sellers;
          console.log({sellers});
        });
      } else {
        this.sellers = [
          {'id': "dnyQSJP0LhS", 'sellerName': "chandru Seller", 'mobile': "8526868928", 'gst': "32713", 'address1': "komarapalayam",'disabled': true}
        ]
      }
    });
  }

  deleteSeller(e,seller){
    if (e) {
      e.stopPropagation();
    }
    this.dbService.deleteSeller(seller.id).then(
      async (res) => {
        const toast = await this.toast.create({
          message: 'Seller deleted',
          duration: 2500,
        });
        toast.present();
      },
      (error) => console.error(error)
    );
  }

  edit(seller){
    console.log({seller})
    console.log(seller.disabled)

    if(seller['disabled'] == true){
      seller['disabled'] = false
      console.log(seller.disabled)
    } 
    else {
      seller['disabled'] = true
      if(seller.sellerName == null || seller.sellerName == ''  ){
        alert("seller name Cannot be empty!")
      } else {
        console.log(seller.disabled)
        this.editSeller(seller)
      }
    }
  }

  addSeller(seller){
    
    this.dbService
    .addSeller(seller)
    .then(
      (res) => {
      },
      async () => {
        const toast = await this.toast.create({
          duration: 2500,
          message: 'Failed to add seller',
        });
        toast.present();
      }
    );
  }

  editSeller(seller) {
    this.dbService
    .updateSeller(seller)
    .then(
      (res) => {
      },
      async () => {
        const toast = await this.toast.create({
          duration: 2500,
          message: 'Failed to Edit Customer',
        });
        toast.present();
      }
    );
  }


  async presentModal(type, seller) {

    if (type == "edit") {
      const modal = await this.modalController.create({
        component: SellerModalPage,
        cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'seller': seller
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.editSeller(modelData.data.seller);
        }
      });
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: SellerModalPage,
        cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'seller': undefined
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.addSeller(modelData.data.seller);
        }
      });
      return await modal.present();
    }

  }

  back(){
    this.navController.pop();
  }

}
