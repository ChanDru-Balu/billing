import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { DbService } from '../db.service';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { Song } from '../home/song';
import { Category } from './category';
import { CatModalPage } from './cat-modal/cat-modal.page';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categoryFormGroup: FormGroup;
  categroyFormData: any;
  songs: Song[];
  categories: Category[];
  categroy: string;
  name: any
  constructor(
    private formBuilder: FormBuilder,
    private dbService: DbService,
    private toast: ToastController,
    private modalController: ModalController,
    private navCtrl: NavController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.categories = [  
    { categoryName: "category one",  id: "5NAsDXhCsdi" , disabled: true },
    { categoryName: "category two",  id: "5NAsDXhCsde" , disabled: true },
    { categoryName: "category three",id: "5NAsDXhCssw" , disabled: true },
    { categoryName: "category four", id: "5NAsDXhCsju" , disabled: true }
  ]

    console.log("Cat Array:",this.categories);
    
    let arrString = '';
    arrString = JSON.stringify(this.categories);
    console.log("CatSting:",arrString);
    let parseArray : any = [];
    parseArray = arrString;
    console.log({parseArray});
    let finalArray = [];
    finalArray = JSON.parse(parseArray);
    console.log({finalArray});
    
    this.categroyFormData = {
      inputs: [
        { label: 'Category Name', formControlName: 'categroy', type: 'text' },
      ],
    };

    this.generateEmptyForm();
    this.dbService.dbState().subscribe((res) => {
      if (res) {
        this.dbService.fetchCategories().subscribe(async (categories: Category[]) => {
          this.categories = categories;
          for(let i=0;i<this.categories.length;i++){
            console.log("Category No:",i,"-",this.categories[i])
            this.categories[i]['disabled'] = true
          }
        });
      }
    });

  }

  changeValue(i,ev: any){
    console.log(i,ev)
    this.categories[i].categoryName = ev.detail.value
    console.log(this.categories[i].categoryName)
  }

  edit(category){
    console.log({category})
    console.log(category.disabled)

    if(category['disabled'] == true){
      category['disabled'] = false
      console.log(category.disabled)
    } 
    else {
      category['disabled'] = true
      if(category.categoryName == null || category.categoryName == ''  ){
        alert("Category name Cannot be empty!")
      } else {
        console.log(category.disabled)
        this.editCategory(category)
      }
    }
  }

  calculateStuff(i){
    return i+1;
  }

  generateEmptyForm() {
    this.categoryFormGroup = this.formBuilder.group({});
    _.forEach(this.categroyFormData.inputs, (input: any) => {
      this.categoryFormGroup.addControl(
        input.formControlName,
        new FormControl('', Validators.required)
      );
    });
  }

  addCategory(category) {
    this.dbService
      .addCategory({
        categoryName: category,
        disabled: false
      })
      .then(
        (res) => {
          this.categoryFormGroup.reset();

        },
        async () => {
          const toast = await this.toast.create({
            duration: 2500,
            message: 'Failed to add Category',
          });
          toast.present();
        }
      );
  }

  deleteCategory(e, id: string) {
    if (e) {
      e.stopPropagation();
    }
    this.dbService.deleteCategroy(id).then(
      async (res) => {
        const toast = await this.toast.create({
          message: 'Category deleted',
          duration: 2500,
        });
        toast.present();
      },
      (error) => console.error(error)
    );
  }

  editCategory(category) {
    this.dbService
    .updateCategory(category.id,category.categoryName)
    .then(
      (res) => {
        this.categoryFormGroup.reset();
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

  clearAllCategories(e) {
    this.dbService.deleteAllCategories().then(
      () => { },
      async () => {
        const toast = await this.toast.create({
          message: 'Failed to Delete All',
          duration: 2500,
        });
        toast.present();
      }
    );
  }

  async presentModal(type, category) {

    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (data) => {
            console.log({data})
            // {"categoryName":"category four","id":"5NAsDXhCsju","disabled":true}
            this.addCategory(data.categoryName);
          },
        },
      ],
      inputs: [
        {
          name: 'categoryName',
          placeholder: 'Category (max 15 characters)',
          attributes: {
            maxlength: 15,
            minlength: 2,
          },
        }
      ],
    });

    await alert.present();


    // if (type == "edit") {
    //   const modal = await this.modalController.create({
    //     component: CatModalPage,
    //     cssClass: 'cat-modal',
    //     backdropDismiss: false,
    //     componentProps: {
    //       'type': type,
    //       'category': category.categoryName
    //     }
    //   });
    //   modal.onDidDismiss().then((modelData) => {
    //     if (modelData !== null) {
    //       this.editCategory(modelData.data.category);
    //     }
    //   });
    //   return await modal.present();
    // } else {
    //   const modal = await this.modalController.create({
    //     component: CatModalPage,
    //     cssClass: 'cat-modal',
    //     backdropDismiss: false,
    //     componentProps: {
    //       'type': type,
    //       'category': undefined
    //     }
    //   });
    //   modal.onDidDismiss().then((modelData) => {
    //     if (modelData !== null) {
    //       this.addCategory(modelData.data.category);
    //     }
    //   });
    //   return await modal.present();
    // }

  }

  back(){
    this.navCtrl.pop();
  }

}
