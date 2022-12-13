import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { DbService } from 'src/app/db.service';
import { Product } from 'src/app/product/product';
import { Sales } from 'src/app/sales/sales';
import { Customer } from '../../customer/customer';

@Component({
  selector: 'app-sales-modal',
  templateUrl: './sales-modal.page.html',
  styleUrls: ['./sales-modal.page.scss'],
})
export class SalesModalPage implements OnInit {

  @Input() type: string;
  @Input() salesExist: any;

  customers: Customer[];
  customer: any;
  invoice: any;
  product: {
    productName: string,
    price: string,
    qunatity: string,
    total: string
  };
  items: any = [];
  products: Product[];
  prodIndex: any;
  total: number;
  discount: number = 0;
  grandTotal: number;
  date: any;
  invoice_details: any = {};
  sales: any;
  saleses: any;
  oldItemsArray : any;


  constructor(
    private modalController: ModalController,
    private dbService: DbService,
    private toast: ToastController,
    private dbservice: DbService
  ) {
    console.log('items:',this.items);
    
    this.items = []
   }

  ngOnInit() {

    var year = new Date().toLocaleString('default', { year: 'numeric' });
    var month = new Date().toLocaleString('default', { month: '2-digit' });
    var day = new Date().toLocaleString('default', { day: '2-digit' });
    this.date = year + "-" + month + "-" + day;

    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchProducts().subscribe(async (products: Product[]) => {
          this.products = products;
        });
      }
    });
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchCustomers().subscribe(async (customers: Customer[]) => {
          this.customers = customers;
        });
      }
    });

    if (this.type == 'edit') {
      let obj = {};
      obj = this.dbService.salesObj;
      console.log({obj});
      
      this.date = obj['sellDate'];
      this.invoice = obj['invoice'];
      this.total = obj['total'];
      this.discount = obj['discount'];
      this.grandTotal = obj['grandTotal'];
      this.items = JSON.parse(obj['items']);
      console.log("Items:",this.items);
      for(let i=0;i<this.items.length;i++){
        console.log("Items Iteration:",this.items[i])
      this.items[i].product = this.products.find(o => o.id === this.items[i].productId);

      }
      let customer = this.customers.find(o => o.id === obj['customerId']);
      this.customer = customer;
      console.log({customer});
      
    }
  }

  addItem() {

    let product = {
      price: 0,
      quantity: 0,
      total: 0
    }
    this.items.push(product);
  }

  productSelect(event: any, i) {
    let product = this.products.find(product => product.id === event.detail.value )
    console.log({product});
    this.items[i]['productId'] = product['id'];
    let gst = (Number(product['gst']) * 0.01 * Number(product['price']));
    this.items[i]['price'] = (Number(product['price']) + Number(gst)).toFixed(2);
    this.items[i]['total'] = Number(this.items[i]['price']) * Number(this.items[i].quantity);
    console.log("Item Content:",this.items[i])
    this.calculateTotal();
  }

  itemInput(e: any, i) {
    let baseCount = 0;
    this.items[i]['quantity'] = e.detail.value;
    this.items[i]['total'] = (this.items[i]['price'] * e.detail.value).toFixed(2);
    console.log("Item Content:",this.items[i])

    this.calculateTotal();

    this.dbService.getProductCount(this.items[i].productName)
    .then((res)=>{
      baseCount = res['quantity'];
    })
    .catch((error)=>{
      JSON.stringify(error);
    });

  }

  calculateTotal() {
    this.total = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.total = parseFloat((this.total + Number(this.items[i]['total'])).toFixed(2));
    }
  }

  discountInput(event: any) {
    this.grandTotal = this.total - this.discount;
  }

  submit() {
    console.log("Customer:",this.customer);
    
    if (this.type == 'edit') {
      let obj = {};
      obj['id'] = this.salesExist['id'];
      obj['sellDate'] = this.date;
      obj['invoice'] = this.invoice;
      obj['total'] = this.total;
      obj['discount'] = this.discount;
      obj['grandTotal'] = this.grandTotal;
      obj['customerId'] = this.customer['id'];

      this.editSales(obj);
    } else {

      let obj = {};
      
      obj['sellDate'] = this.date;
      obj['invoice'] = this.invoice;
      obj['total'] = this.total;
      obj['discount'] = this.discount;
      obj['grandTotal'] = this.grandTotal;
      obj['customerId'] = this.customer['id'];
      console.log({obj})

      this.addSales(obj);

    }

  }

  editSales(sales) {
    console.log("Items:",this.items)
    this.dbService
      .updateSales(sales, JSON.stringify(this.items),this.oldItemsArray)
      .then(
        (res) => {
          this.modalController.dismiss({
            status: true
          });
          this.getAllSales();
        },
        async () => {
          const toast = await this.toast.create({
            duration: 2500,
            message: 'Failed to add Sales Bill',
          });
          toast.present();
        }
      );
  }

  addSales(purchase) {
    this.dbService
      .addSales(purchase, JSON.stringify(this.items))
      .then(
        (res) => {
          this.items = [];
          this.modalController.dismiss({
            status: true
          });
        },
        async () => {
          const toast = await this.toast.create({
            duration: 2500,
            message: 'Failed to Edit Sales Bill',
          });
          toast.present();
        }
      );
  }

  getAllSales() {
    this.dbservice.getAllSalses().then((res) => {  this.saleses = res['data'] }).catch((error) => {  });
  }

  
  dismiss() {
    this.modalController.dismiss();
  }

}
