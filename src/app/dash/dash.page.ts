import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { DbService } from '../db.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {
  categoriesCount: any;
  totalQty: any;
  totalPurchases: any;
  totalSales: any;
  customers: any;
  sellers: any;

  features: any[] = [];
  totalProducts: any;
 
  

  constructor(private navCtrl: NavController, private dbService: DbService,private loadingController: LoadingController) {

   
    this.dbService.dbState().subscribe(async (res) => {
      const loading =await this.loadingController.create({
        message: 'Dismissing after 3 seconds...',
        duration: 3000,
      });
  
      loading.present();
      if (res) {
        this.dbService.fetchCategories().subscribe(async (categories: any) => {
          console.log({ categories });
          this.categoriesCount = categories.length;
          localStorage.setItem('categoryCount', this.categoriesCount);
        });
        this.dbService.fetchProducts().subscribe(async (products: any) => {
          console.log({ products });
          this.totalProducts = products.length;
          if (products.length > 0) {
            console.log(products[0]['totalQty']);
            localStorage.setItem('totalQty', products[0]['totalQty']);
            this.totalQty = await products[0]['totalQty'];
          }
        });
        this.dbService.fetchPurchases().subscribe(async (purchases: any) => {
          console.log({ purchases });
          if (purchases.length > 0) {
            console.log(purchases[0]['sum']);
            localStorage.setItem('totalSales', purchases[0]['sum']);
            this.totalPurchases = await purchases[0]['sum'];
          }
        });
        this.dbService.fetchSaleses().subscribe(async (saleses: any) => {
          console.log({ saleses });
          if (saleses.length > 0) {
            console.log(saleses[0]['sum']);
            localStorage.setItem('totalSales', saleses[0]['sum']);
            this.totalSales = await saleses[0]['sum'];
          }
        });
        this.dbService.fetchCustomers().subscribe(async (customers: any) => {
          console.log({ customers });
          if (customers.length > 0) {
            this.customers = customers.length;
            localStorage.setItem('customers', this.customers);
          }
        });
        this.dbService.fetchSellers().subscribe(async (sellers: any) => {
          console.log({ sellers });
          if (sellers.length > 0) {
            this.sellers = sellers.length;
            localStorage.setItem('sellers', this.sellers);
          }
        });
      }
    });
  }

  async ngOnInit() {
   

    this.features = [
      {
        id: 1,
        name: `Category`,
        message: this.categoriesCount,
        src: 'assets/images/categories.png',
        page: 'category',
      },
      {
        id: 2,
        name: 'Products',
        message:this.totalQty,
        src: 'assets/images/products.png',
        page: 'product',
      },
      {
        id: 3,
        name: 'Customers',
        message: this.customers,
        src: 'assets/images/customers.png',
        page: 'customer',
      },
      {
        id: 4,
        name: 'Sellers',
        message: this.sellers,
        src: 'assets/images/sellers.png',
        page: 'seller',
      },
      {
        id: 5,
        name: 'Purchase',
        message: this.totalPurchases,
        src: 'assets/images/purchase.png',
        page: 'purchase',
      },
      { 
        id: 6, 
        name: 'Sales', 
        message:this.totalSales,
        src: 'assets/images/sales.png', 
        page: 'sales' 
      },
    ];
    console.log("Features:",this.features);
    
  }

  nav(page) {
    this.navCtrl.navigateForward(page);
  }

  upcoming() {
    this.navCtrl.navigateForward('upcoming');
  }
}
