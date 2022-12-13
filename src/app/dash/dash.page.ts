import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {

  features: any[] = [
    {id: 1 , name:'Category', src: 'assets/images/categories.png' ,page: 'category' },
    {id: 2 , name:'Products', src: 'assets/images/products.png' ,page: 'product'},
    {id: 3 , name:'Customers', src: 'assets/images/customers.png' ,page: 'customer'},
    {id: 4 , name:'Sellers', src: 'assets/images/sellers.png' ,page: 'seller'},
    {id: 5 , name:'Purchase', src: 'assets/images/purchase.png' ,page: 'purchase'},
    {id: 6 , name:'Sales', src: 'assets/images/sales.png' ,page: 'sales'}
  ]

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  nav(page){
    this.navCtrl.navigateForward(page);
  }

  upcoming(){
    this.navCtrl.navigateForward('upcoming');
  }

}
