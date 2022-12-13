import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-prod-modal',
  templateUrl: './prod-modal.page.html',
  styleUrls: ['./prod-modal.page.scss'],
})
export class ProdModalPage implements OnInit {

  @Input() type: string;
  @Input() categories: any;
  @Input() product: any;
  
  category: any ;
  name: any;
  gst: any;
  price: any;



  submitValue: boolean = false;
  constructor(
    private modalController: ModalController
  ) { 
    
    if(this.product){
      console.log("Product:",this.product);
    }
    
  }

  ngOnInit() {
    console.log("Categories:",this.categories);
    console.log("Product:",this.product);
    
    if(this.type == "edit"){
      this.category = this.categories.find(category => category.id === this.product.categoryId) ;
      this.name = this.product.productName;
      this.gst = this.product.gst;
      this.price = this.product.price;
    }
  }

  categorySelected(ev:any){
    console.log({ev});
    console.log("category:",this.category);
    
  }

  dismiss(){
    this.modalController.dismiss();
  }

  submit(){
    console.log("Category:",this.category)
    if(this.type === 'edit'){
      this.modalController.dismiss({
        categoryId: this.category['id'],
        name: this.name,
        gst: this.gst,
        price: this.price,
        id: this.product.id
      });
    } else {
      this.modalController.dismiss({
        categoryId: this.category['id'],
        name: this.name,
        gst: this.gst,
        price: this.price
      });

    }
   
  }

  categoryInput(variable){
    if(
      this.category == null || this.category == undefined || this.category == '' ||
      this.name == null || this.name == undefined || this.name == '' ||
      this.price == null || this.price == undefined || this.price == '' ||
      this.gst == null || this.gst == undefined || this.gst == ''
    ){
      this.submitValue = true;
    }else{
      this.submitValue = false;
    }
  }

}
