import { Component, Input, OnInit } from '@angular/core';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { Purchase } from 'src/app/purchase';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit {

  @Input() type: string;
  @Input() purchase: Purchase;

  order: any =  {
    address: {
      title: 'Home',
      name: 'Maida',
      flatNumber: 115,
      street: 'Brighton Road',
      locality: 'Brighton'
    },
    grandTotal: 87,
    products: [
      {
        images: ['apple.jpg'],
        name: 'Apple',
        offer: 10,
        salePrice: 2.7,
        regularPrice: 3,
        units: 10
      },
      {
        images: ['biryani.jpg'],
        name: 'Biryani',
        offer: 20,
        salePrice: 12,
        regularPrice: 15,
        units: 5
      }
    ],
    status: 'Delivered',
    paymentId: '6654',
    delivery_status: 'Unassigned',
    createdAt: 'Nov 3, 2020 3:49 PM'
  }

  details: { itemName: string; quantity: number; }[];
  content: string;
  items: any ;
  shopName: any;

  constructor(private pdfGenerator: PDFGenerator,private socialSharing: SocialSharing,private modalController: ModalController) { }

  ngOnInit() {
    this.shopName = localStorage.getItem('shop');
    this.items = JSON.parse(this.purchase['items']);
  }

  downloadInvoice() {
    this.content = document.getElementById('PrintInvoice').innerHTML;
    let options = {
      documentSize: 'A4',
      type: 'share',
      // landscape: 'portrait',
      fileName: this.purchase.invoice+'.pdf'
    };
    this.pdfGenerator.fromData(this.content, options)
      .then((base64) => {
        var contentType = "application/pdf";
      }).catch((error) => {
      });
  }

    shareViaWhatsApp(){
      let message : any = '';
      let sno = 1;
      for(let i=0;i<this.items.length;i++){
        message = message+sno.toString()+'.';
        message = message + this.items[i].productName+"(rs."+this.items[i].total+")";
        sno = sno+1;
        if((i+1) < this.items.length){
          message = message + ' and ';
        }
      }
      message = "The purchased items for the invoice no."+ this.purchase.invoice +" are " + message + " Purchased on " + this.purchase.purchaseDate;

      this.socialSharing.share(message,null,null,null).then((res) => {
       
      }).catch((error) => {
       
      });

    }

    dismiss(){
      console.log("Modal Controller:",this.modalController)
      this.modalController.dismiss();
    }
  

}
