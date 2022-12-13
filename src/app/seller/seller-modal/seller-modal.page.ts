import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-seller-modal',
  templateUrl: './seller-modal.page.html',
  styleUrls: ['./seller-modal.page.scss'],
})
export class SellerModalPage implements OnInit {

  @Input() type: string;
  @Input() seller: any;

  sellerName: any;
  mobile: any;
  gst: any;
  address1: any;
  
  // category: any;
  submitValue: boolean = true;
  constructor(
    private modalController: ModalController
  ) { 
   
  }

  ngOnInit() {
    if(this.type == "edit"){
      this.sellerName = this.seller.sellerName;
      this.mobile = this.seller.mobile;
      this.gst = this.seller.gst;
      this.address1 = this.seller.address1;
    }
  }

  dismiss(){
    this.modalController.dismiss();
  }

  submit(){
    let sellerDetails = {};
    sellerDetails['sellerName'] = this.sellerName;
    sellerDetails['mobile'] = this.mobile;
    sellerDetails['gst'] = this.gst;
    sellerDetails['address1'] = this.address1;
    if(this.type == 'edit'){
      sellerDetails['id'] = this.seller.id;
    }
    this.modalController.dismiss({
      seller: sellerDetails
    });
  }

  sellerInput(){
    if(
      this.sellerName == null || this.sellerName == undefined || this.sellerName == '' ||
      this.mobile == null || this.mobile == undefined || this.mobile == '' ||
      this.gst == null || this.gst == undefined || this.gst == '' ||
      this.address1 == null || this.address1 == undefined || this.address1 == '' 
      ){
      this.submitValue = true;
    }else{
      this.submitValue = false;
    }
  }

}