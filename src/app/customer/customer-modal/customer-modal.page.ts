import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-customer-modal',
  templateUrl: './customer-modal.page.html',
  styleUrls: ['./customer-modal.page.scss'],
})
export class CustomerModalPage implements OnInit {

  @Input() type: string;
  @Input() customer: any;

  customerName: any;
  mobile: any;
  address: any;
  
  // category: any;
  submitValue: boolean = true;
  constructor(
    private modalController: ModalController
  ) { 
   
  }

  ngOnInit() {
    if(this.type == "edit"){
      this.customerName = this.customer.customerName;
      this.mobile = this.customer.mobile;
      this.address = this.customer.address1;
    }
  }

  dismiss(){
    this.modalController.dismiss();
  }

  submit(){
    let customerDetails = {};
    customerDetails['customerName'] = this.customerName;
    customerDetails['mobile'] = this.mobile;
    customerDetails['address1'] = this.address;
    if(this.type == 'edit'){
      customerDetails['id'] = this.customer.id;
    }
    this.modalController.dismiss({
      customer: customerDetails
    });
  }

  customerInput(){
    if(
      this.customerName == null || this.customerName == undefined || this.customerName == '' ||
      this.mobile == null || this.mobile == undefined || this.mobile == '' ||
      this.address == null || this.address == undefined || this.address == '' 
      ){
      this.submitValue = true;
    }else{
      this.submitValue = false;
    }
  }

}