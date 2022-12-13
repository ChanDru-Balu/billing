import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/db.service';
import { Product } from 'src/app/product/product';
import { Purchase } from 'src/app/purchase/purchase';
import { Seller } from '../../seller/seller';

@Component({
  selector: 'app-purchase-modal',
  templateUrl: './purchase-modal.page.html',
  styleUrls: ['./purchase-modal.page.scss'],
})
export class PurchaseModalPage implements OnInit {
  @Input() type: string;
  @Input() purchaseExist: any;

  sellers: Seller[];
  seller: any;
  invoice: any;
  product: {
    productName: string;
    price: string;
    qunatity: string;
    total: string;
  };
  items: any = [];
  products: Product[];
  prodIndex: any;
  total: number;
  discount: number;
  grandTotal: number;
  date: any ;
  invoice_details: any = {};
  purchase: any;
  purchases: any;
  oldItemsArray: any;

  constructor(
    private modalController: ModalController,
    private dbService: DbService,
    private toast: ToastController,
    private dbservice: DbService
  ) {
    console.log('items:', this.items);

    this.items = [];
  }

  ngOnInit() {
    var year = new Date().toLocaleString('default', { year: 'numeric' });
    var month = new Date().toLocaleString('default', { month: '2-digit' });
    var day = new Date().toLocaleString('default', { day: '2-digit' });
    this.date = year + "-" + month + "-" + day;
    
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService
          .fetchProducts()
          .subscribe(async (products: Product[]) => {
            this.products = products;
          });
      }
    });
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchSellers().subscribe(async (sellers: Seller[]) => {
          this.sellers = sellers;
          console.log('SELLERS:', JSON.stringify(this.sellers));
        });
      }
    });

    if (this.type == 'edit') {
      let obj = {};
      obj = this.dbService.purchaseObj;
      this.date = obj['purchaseDate'];
      this.invoice = obj['invoice'];
      this.total = obj['total'];
      this.discount = obj['discount'];
      this.grandTotal = obj['grandTotal'];
      this.items = JSON.parse(obj['items']);
      this.oldItemsArray = JSON.parse(obj['items']);
      for (let i = 0; i < this.items.length; i++) {
        console.log('Items Iteration:', this.items[i]);
        this.items[i].product = this.products.find(
          (o) => o.id === this.items[i].productId
        );
      }
      let seller = this.sellers.find((o) => o.id === obj['sellerId']);
      this.seller = seller;
    }
  }

  addItem() {
    let product = {
      price: 0,
      quantity: undefined,
      total: undefined,
    };
    this.items.push(product);
  }

  productSelect(event: any, i) {
    console.log('Items:', this.items);

    let product = this.products.find(
      (product) => product.id === event.detail.value
    );
    console.log({ product });
    for (let i = 0; i < this.items.length; i++) {
      console.log(this.items[i]);
    }
    // let seen = new Set();
    // var hasDuplicates = this.items.some(function (currentObject) {
    //   return seen.size === seen.add(currentObject.productId).size;
    // });
    // console.log({ hasDuplicates });
    // if(hasDuplicates){
    //   alert("Cannot Add Same Product Twice! "+i)
    //   alert(JSON.stringify(this.items))
    //   this.items.slice(i,1)
    // }

    this.items[i]['productId'] = product['id'];
    let gst = Number(product['gst']) * 0.01 * Number(product['price']);
    this.items[i]['price'] = (Number(product['price']) + Number(gst)).toFixed(
      2
    );
    this.items[i]['total'] =
      Number(this.items[i]['price']) * Number(this.items[i].quantity);
    console.log('Item Content:', this.items[i]);
    console.log('Items:', this.items);

    this.calculateTotal();
  }

  itemInput(e: any, i) {
    let baseCount = 0;
    this.items[i]['quantity'] = e.detail.value;
    this.items[i]['total'] = (this.items[i]['price'] * e.detail.value).toFixed(
      2
    );
    console.log('Item Content:', this.items[i]);

    this.calculateTotal();

    this.dbService
      .getProductCount(this.items[i].productName)
      .then((res) => {
        baseCount = res['quantity'];
      })
      .catch((error) => {
        JSON.stringify(error);
      });
  }

  calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.total = parseFloat(
        (this.total + Number(this.items[i]['total'])).toFixed(2)
      );
    }
  }

  discountInput(event: any) {
    this.grandTotal = Number(this.total - this.discount);
  }

  submit() {
    if (this.type == 'edit') {
      let obj = {};

      obj['id'] = this.dbService.purchaseObj['id'];
      obj['purchaseDate'] = this.date;
      obj['invoice'] = this.invoice;
      obj['total'] = this.total;
      obj['discount'] = this.discount;
      obj['grandTotal'] = this.grandTotal;
      obj['sellerId'] = this.seller['id'];
      console.log({ obj });

      this.editPurchase(obj);
    } else {
      let obj = {};

      obj['purchaseDate'] = this.date;
      obj['invoice'] = this.invoice;
      obj['total'] = this.total;
      obj['discount'] = this.discount;
      obj['grandTotal'] = this.grandTotal;
      obj['sellerId'] = this.seller['id'];

      console.log({ obj });
      this.addPurchase(obj);
    }
  }

  editPurchase(purchase) {
    this.dbService
      .updatePurchase(purchase, JSON.stringify(this.items), this.oldItemsArray)
      .then(
        (res) => {
          this.items = [];
          this.modalController.dismiss({
            status: true,
          });
          this.getAllPurchases();
        },
        async () => {
          const toast = await this.toast.create({
            duration: 2500,
            message: 'Failed to add Product',
          });
          toast.present();
        }
      );
  }

  addPurchase(purchase) {
    console.log({ purchase }, this.items);
    this.dbService.addPurchase(purchase, JSON.stringify(this.items)).then(
      (res) => {
        this.items = [];

        this.modalController.dismiss({
          status: true,
        });
        this.getAllPurchases();
      },
      async () => {
        const toast = await this.toast.create({
          duration: 2500,
          message: 'Failed to add Product',
        });
        toast.present();
      }
    );
  }

  getAllPurchases() {
    this.dbservice
      .getAllPurchases()
      .then((res) => {
        this.purchases = res['data'];
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  dateChange(ev: any) {
    console.log({ ev });
  }
}
