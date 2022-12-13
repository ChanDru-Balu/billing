import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DbService } from '../db.service';
import { AlertController, ModalController, NavController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { Customer } from '../customer';
import { CustomerModalPage } from './customer-modal/customer-modal.page';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {

  customers: Customer[];
  customer: string;

  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private toast: ToastController,
    private modalController: ModalController,
    private navController: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchCustomers().subscribe(async (customers: Customer[]) => {
          this.customers = customers;
          console.log({customers});
        });
      } else{
        // this.customers = [
        //   { 'address1': "ottan kovil", 'customerName': "chandru", 'id': "zNFf9XYIhJN", 'mobile': 8526868928, disabled: true }
        // ]
      }
    });
  }

  edit(customer){
    console.log({customer})
    console.log(customer.disabled)

    if(customer['disabled'] == true){
      customer['disabled'] = false
      console.log(customer.disabled)
    } 
    else {
      customer['disabled'] = true
      if(customer.customerName == null || customer.customerName == ''  ){
        alert("Customer name Cannot be empty!")
      } else {
        console.log(customer.disabled)
        this.editCustomer(customer)
      }
    }
  }



  changeValue(i,ev: any){
    console.log(i,ev)
    this.customers[i].customerName = ev.detail.value
    console.log(this.customers[i].customerName)
  }

  deleteCustomer(e,customer){
    if (e) {
      e.stopPropagation();
    }
    this.dbService.deleteCustomer(customer.id).then(
      async (res) => {
        const toast = await this.toast.create({
          message: 'Customer deleted',
          duration: 2500,
        });
        toast.present();
      },
      (error) => console.error(error)
    );
  }

  addCustomer(customer){
    
    this.dbService
    .addCustomer(customer)
    .then(
      (res) => {
      },
      async () => {
        const toast = await this.toast.create({
          duration: 2500,
          message: 'Failed to add Category',
        });
        toast.present();
      }
    );
  }

  editCustomer(customer) {
    this.dbService
    .updateCustomer(customer)
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


  async presentModal(type, customer) {

    if (type == "edit") {
      const modal = await this.modalController.create({
        component: CustomerModalPage,
        cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'customer': customer
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.editCustomer(modelData.data.customer);
        }
      });
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: CustomerModalPage,
        cssClass: 'customer-modal',
        backdropDismiss: false,
        componentProps: {
          'type': type,
          'category': undefined
        }
      });
      modal.onDidDismiss().then((modelData) => {
        if (modelData !== null) {
          this.addCustomer(modelData.data.customer);
        }
      });
      return await modal.present();
    }

  }

  back(){
    this.navController.pop();
  }

}
