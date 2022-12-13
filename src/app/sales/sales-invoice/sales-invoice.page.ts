import { Component, Input, OnInit } from '@angular/core';
import { PDFGenerator } from '@awesome-cordova-plugins/pdf-generator/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { Sales } from 'src/app/sales';

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

  constructor(
    private pdfGenerator: PDFGenerator,
    private socialSharing: SocialSharing,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.shopName = localStorage.getItem('shop');
    this.items = JSON.parse(this.sales['items']);
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
