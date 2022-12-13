import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  name: any;
  shop: any;
  mobile: any;
  gst: any;
  address: any;

  constructor() {
    this.name = localStorage.getItem('name');
    this.shop = localStorage.getItem('shop');
    this.mobile = localStorage.getItem('mobile');
    this.gst = localStorage.getItem('gst');
    this.address = localStorage.getItem('address');
   }

  ngOnInit() {
  }

  submit(){

    localStorage.setItem('name',this.name);
    localStorage.setItem('shop',this.shop);
    localStorage.setItem('mobile',this.mobile);
    localStorage.setItem('gst',this.gst);
    localStorage.setItem('address',this.address);

  }

}
