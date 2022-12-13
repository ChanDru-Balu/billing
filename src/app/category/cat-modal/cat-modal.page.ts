import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cat-modal',
  templateUrl: './cat-modal.page.html',
  styleUrls: ['./cat-modal.page.scss'],
})
export class CatModalPage implements OnInit {

  @Input() type: string;
  @Input() category: any;
  
  // category: any;
  submitValue: boolean = true;
  constructor(
    private modalController: ModalController
  ) { 
    // if(this.type == "edit"){

    // }
  }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss();
  }

  submit(){
    this.modalController.dismiss({
      category: this.category
    });
  }

  categoryInput(){
    if(this.category == null || this.category == undefined || this.category == ''){
      this.submitValue = true;
    }else{
      this.submitValue = false;
    }
  }

}
