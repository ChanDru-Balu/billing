import { Component, Input, OnInit } from '@angular/core';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { Customer } from 'src/app/customer/customer';
import { DbService } from 'src/app/db.service';
import { Sales } from 'src/app/sales/sales';

@Component({
  selector: 'app-sales-invoice',
  templateUrl: './sales-invoice.page.html',
  styleUrls: ['./sales-invoice.page.scss'],
})
export class SalesInvoicePage implements OnInit {
  @Input() type: string;
  @Input() sales: Sales;

  details: { itemName: string; quantity: number }[];
  content: string;
  items: any;
  shopName: any;
  customers: any;
  customer:any;
  test: boolean = false
  innerHtml: any;
  products: any;
  
  constructor(
    private pdfGenerator: PDFGenerator,
    private socialSharing: SocialSharing,
    private modalController: ModalController,
    private dbService: DbService
  ) {}

  ngOnInit() {
    this.shopName = localStorage.getItem('shop');
    this.items = JSON.parse(this.sales['items']);

    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchCustomers().subscribe(async (customers: Customer[]) => {
          this.customers = customers;
          this.customer = this.customers.find(customer => customer.id === this.sales['customerId'] )
          this.dbService.fetchProducts().subscribe(async (products) => {
            console.log({products})
            this.products = products;
            this.items.forEach(element => {
              let product = this.products.find(prod => prod.id == element['productId'])
              element['product'] = product 
              console.log({element})
            });
          } )
        });
      }
    });
  }

  downloadInvoice() {

    this.content = document.getElementById('PrintInvoice').innerHTML;
    let options = {
      documentSize: 'A4',
      type: 'share',
      // landscape: 'portrait',
      fileName: this.sales.invoice + '.pdf',
    };
    this.pdfGenerator
      .fromData(this.content, options)
      .then((base64) => {
        var contentType = 'application/pdf';
      })
      .catch((error) => {});
  }

  shareViaWhatsApp() {
    let message: any = '';
    let sno = 1;
    for (let i = 0; i < this.items.length; i++) {
      message = message + sno.toString() + '.';
      message =
        message +
        this.items[i].productName +
        '(rs.' +
        this.items[i].total +
        ')';
      sno = sno + 1;
      if (i + 1 < this.items.length) {
        message = message + ' and ';
      }
    }
    message =
      'The salesd items for the invoice no.' +
      this.sales.invoice +
      ' are ' +
      message +
      ' salesd on ' +
      this.sales.sellDate;

    this.socialSharing
      .share(message, null, null, null)
      .then((res) => {})
      .catch((error) => {});
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
