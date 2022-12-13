import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DbService } from '../db.service';
import {
  AlertController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import * as _ from 'lodash';
import { Product } from '../product';
import { Category } from '../category';
import { ProdModalPage } from './prod-modal/prod-modal.page';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  productFormGroup: FormGroup;
  productFormData: any;
  products: any = [];
  categories: Category[];
  category: any;


  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private dbService: DbService,
    private toast: ToastController,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {

    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService
          .fetchProducts()
          .subscribe(async (products: Product[]) => {
            this.products = products;
            this.dbService
              .fetchCategories()
              .subscribe(async (categories: Category[]) => {
                this.categories = categories;
                console.log({categories});
                for (let i = 0; i < this.products.length; i++) {
                  this.products[i]['disabled'] = true;
                  this.products[i]['category'] = this.categories.find(category => category.id === this.products[i].categoryId)
                }
                console.log("Products:",this.products);
              });
          });
      }
    });
  }

  categorySelected(ev: any,product: any,i:number){
    console.log(ev,i,product);
    this.products[i].category = this.categories.find(category => category.id === ev )
    console.log("Products:",this.products);
    
    
  }

  addProduct(product) {
    console.log({product})
    this.dbService
      .addProduct({
        categoryId: product.categoryId,
        productName: product.name,
        gst: product.gst,
        price: product.price,
        quantity: 0
      })
      .then(
        (res) => {
          console.log({res})
          this.productFormGroup.reset();
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

  deleteProduct(id: string) {
    this.dbService.deleteProduct(id).then(
      async (res) => {
        const toast = await this.toast.create({
          message: 'Product deleted',
          duration: 2500,
        });
        toast.present();
      },
      (error) => console.error(error)
    );
  }

  editProduct(product: any) {
    console.log("String Product:",product)
    this.dbService.updateProduct(product).then(
      (res) => {
        console.log({res});
      },
      async () => {
        const toast = await this.toast.create({
          duration: 2500,
          message: 'Failed to Edit Category',
        });
        toast.present();
      }
    );
  }

  clearAllProducts(e) {
    this.dbService.deleteAllProducts().then(
      () => {},
      async () => {
        const toast = await this.toast.create({
          message: 'Failed to Delete All',
          duration: 2500,
        });
        toast.present();
      }
    );
  }

  async presentModal(type, product: any) {
    console.log({product});
    
    if (type == 'edit') {
      const modal = await this.modalController.create({
        component: ProdModalPage,
        // cssClass: 'prod-modal',
        backdropDismiss: false,
        componentProps: {
          type: type,
          categories: this.categories,
          product: product,
        },
      });
      modal.onDidDismiss().then((modelData) => {
        console.log({modelData});
        
        if (modelData !== null) {
          this.editProduct(modelData.data);
        }
      });
      return await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: ProdModalPage,
        // cssClass: 'prod-modal',
        backdropDismiss: false,
        componentProps: {
          type: type,
          categories: this.categories,
          product: undefined,
        },
      });
      modal.onDidDismiss().then((modelData) => {
        console.log({modelData});
        
        if (modelData !== null) {
          this.addProduct(modelData.data);
        }
      });
      return await modal.present();
    }
  }

  back() {
    this.navController.pop();
  }

  changeProduct(product) {
    console.log(product.disabled);
    if (product.disabled) {
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id == product.id) {
          product.disabled = false;
        } else {
          product.disabled = true;
        }
      }
    } else {
      product.disabled = true
      let newProduct = JSON.parse(JSON.stringify(product))
      console.log({newProduct})
      // alert(JSON.stringify(newProduct))
      delete newProduct['disabled'];

      this.editProduct(newProduct);

    }
  }

  onChangeCateory(ev:any, i){
    console.log({ev},i)
  }

  getCategory(categoryId){
    console.log({categoryId});
    let category = this.categories.find(category => category.id === categoryId)
    return category['categoryName']
  }

  async deleteConfirmation(id){
    const alert = await this.alertController.create({
      header: 'Are you Sure Want To Delete The Product!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Alert canceled')
          },
        },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.deleteProduct(id)
          },
        },
      ],
    });

    await alert.present();

  }

  async editModal(id){

  }

}
