import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import * as _ from 'lodash';

import { Song } from './home/song';
import { generateId } from './helper';
import { Category } from './category/category';
import { Product } from './product/product';
import { Customer } from './customer/customer';
import { Seller } from './seller/seller';
import { Purchase } from './purchase/purchase';
import { PurchaseItem } from './purchase/purchase-item';
import { Sales } from './sales/sales';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private storage: SQLiteObject;

  songsList = new BehaviorSubject([]);
  CategoriesList = new BehaviorSubject([]);
  ProductsList = new BehaviorSubject([]);
  CustomerList = new BehaviorSubject([]);
  SellerList = new BehaviorSubject([]);
  purchaseList = new BehaviorSubject([]);
  salesList = new BehaviorSubject([]);
  purchaseItemList = new BehaviorSubject([]);

  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  purchaseObj: any;
  salesObj: any;

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter
  ) {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: 'song_list_db.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getDummyData();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchSongs(): Observable<Song[]> {
    return this.songsList.asObservable();
  }

  fetchCategories(): Observable<Category[]> {
    return this.CategoriesList.asObservable();
  }

  fetchProducts(): Observable<Product[]> {
    return this.ProductsList.asObservable();
  }

  fetchCustomers(): Observable<Customer[]> {
    return this.CustomerList.asObservable();
  }

  fetchSellers(): Observable<Seller[]> {
    return this.SellerList.asObservable();
  }

  fetchPurchases(): Observable<Purchase[]> {
    return this.purchaseList.asObservable();
  }

  fetchSaleses(): Observable<Sales[]> {
    return this.salesList.asObservable();
  }

  // fetchPurchaseItems(): Observable<any[]> {
  //   return this.purchaseItemList.asObservable();
  // }

  getDummyData() {
    this.httpClient
      .get('assets/dumb.sql', { responseType: 'text' })
      .subscribe((data) => {
        this.sqlPorter
          .importSqlToDb(this.storage._objectInstance, data)
          .then(() => {
            // this.getAllSongs();
            this.getAllCategories();
            this.getAllProducts();
            this.getAllCustomers();
            this.getAllSellers();
            this.getAllPurchases();
            this.getAllSalses();
            this.isDbReady.next(true);
          })
          .catch((error) => console.error(error));
      });
  }

  // Purchase

  getAllPurchases() {
    return this.storage
      .executeSql('SELECT * FROM purchasetable;', [])
      .then((res) => {
        const purchases: Purchase[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            purchases.push({
              id: res.rows.item(i).id,
              purchaseDate: res.rows.item(i).purchaseDate,
              invoice: res.rows.item(i).invoice,
              total: res.rows.item(i).total,
              discount: res.rows.item(i).discount,
              grandTotal: res.rows.item(i).grandTotal,
              sellerId: res.rows.item(i).sellerId,
              items: res.rows.item(i).items,
            });
          }
        }
        this.purchaseList.next(purchases);
      });
  }

  addPurchase(purchase: Purchase, items: any) {
    const data = [
      generateId(),
      purchase.purchaseDate,
      purchase.invoice,
      purchase.total,
      purchase.discount,
      purchase.grandTotal,
      purchase.sellerId,
      items,
    ];
    return this.storage
      .executeSql(
        `INSERT INTO purchasetable (id, purchaseDate, invoice, total, discount, grandTotal,
          sellerId,items ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        data
      )
      .then(
        (res) => {
          alert("Purchase Added Successfully!")
          console.log({ items });
          let itemsArray = JSON.parse(items);
          for (let i = 0; i < itemsArray.length; i++) {
            console.log(itemsArray[i]);
          }
          for (let j = 0; j < JSON.parse(items).length; j++) {
            console.log({ j });
            alert(JSON.stringify(JSON.parse(items)[j]))
            console.log(JSON.parse(items)[j]);
            this.increaseProductCount(JSON.parse(items)[j]);
          }
          this.getAllPurchases();
        },
        (error) => {
          console.error(error);
          if (error.code == 6) {
            alert('Invoice Already Exist!');
          }
        }
      );
  }

  updateProductCount(productName: string, count: number) {
    console.log('Count&ProdName,', productName, count);
    return this.storage
      .executeSql(
        'UPDATE producttable SET quantity = ? WHERE productName = ?;',
        [count, productName]
      )
      .then(
        (res) => {
          console.log(JSON.stringify(res));
          return {
            id: res.rows.item(0).id,
            productName: res.rows.item(0).productName,
            quantity: res.rows.item(0).quantity,
          };
        },
        (error) => console.log(JSON.stringify(error))
      );
  }

  updatePurchase(purchase: Purchase, items: any, oldArray: any) {
    console.log('In Service Page:', JSON.parse(items), oldArray);
    return this.storage
      .executeSql(
        `UPDATE purchasetable SET purchaseDate = ?, invoice = ?, total = ?, discount = ?, grandTotal = ?,
         sellerId = ? ,items  = ?
        WHERE id = ?`,
        [
          purchase.purchaseDate,
          purchase.invoice,
          purchase.total,
          purchase.discount,
          purchase.grandTotal,
          purchase.sellerId,
          items,
          purchase.id,
        ]
      )
      .then((data) => {
        let count = JSON.parse(items).length + oldArray.length;
        console.log({ count });
        for (let i = 0; i < 2; i++) {
          console.log({ i });
          if (i < 1) {
            for (let j = 0; j < oldArray.length; j++) {
              console.log({ j });
              console.log(oldArray[j]);
              this.decreaseProductCount(oldArray[j]);
            }
          } else {
            for (let j = 0; j < JSON.parse(items).length; j++) {
              console.log({ j });
              console.log(JSON.parse(items)[j]);
              this.increaseProductCount(JSON.parse(items)[j]);
            }
          }
        }
        this.getAllPurchases();
      })
      .catch((error) => {
        if (error.code == 6) {
          alert('Invoice Already Exist!');
        } else {
          alert(error);
        }
      });
  }

  deletePurchase(id: string) {
    return this.storage
      .executeSql('DELETE FROM purchasetable WHERE id = ?;', [id])
      .then(
        () => this.getAllPurchases(),
        (error) => console.error(error)
      );
  }

  // Sales
  getAllSalses() {
    return this.storage
      .executeSql('SELECT * FROM salestable;', [])
      .then((res) => {
        const saleses: Sales[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            saleses.push({
              id: res.rows.item(i).id,
              sellDate: res.rows.item(i).sellDate,
              invoice: res.rows.item(i).invoice,
              total: res.rows.item(i).total,
              discount: res.rows.item(i).discount,
              grandTotal: res.rows.item(i).grandTotal,
              customerId: res.rows.item(i).customerId,
              items: res.rows.item(i).items,
            });
          }
        }
        this.salesList.next(saleses);
      });
  }

  addSales(sales: Sales, items: any) {
    const data = [
      generateId(),
      sales.sellDate,
      sales.invoice,
      sales.total,
      sales.discount,
      sales.grandTotal,
      sales.customerId,
      items,
    ];
    return this.storage
      .executeSql(
        `INSERT INTO salestable (id, sellDate, invoice, total, discount, grandTotal,
          customerId,items ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        data
      )
      .then(
        (res) => {
          console.log(JSON.stringify(res));
          console.log({ items });
          let itemsArray = JSON.parse(items);
          for (let i = 0; i < itemsArray.length; i++) {
            console.log(itemsArray[i]);
          }
          for (let j = 0; j < JSON.parse(items).length; j++) {
            console.log({ j });
            alert(JSON.stringify(JSON.parse(items)[j]))
            console.log(JSON.parse(items)[j]);
            this.decreaseProductCount(JSON.parse(items)[j]);
          }
          this.getAllSalses();
        },
        (error) => {
          // alert(JSON.stringify(error))
          console.error(error);
          if (error.code == 6) {
            alert('Invoice Already Exist!');
          }
        }
      );
  }

  updateSales(sales: Sales, items: any , oldArray: any) {
    console.log("In Service Page:", JSON.parse(items), { sales });

    return this.storage
      .executeSql(
        `UPDATE salestable SET sellDate = ?, invoice = ?, total = ?, discount = ?, grandTotal = ?,
        customerId = ? ,items  = ?
        WHERE id = ?`,
        [
          sales.sellDate,
          sales.invoice,
          sales.total,
          sales.discount,
          sales.grandTotal,
          sales.customerId,
          items,
          sales.id,
        ]
      )
      .then((data) => {
        console.log({ data });
        let count = JSON.parse(items).length + oldArray.length;
        console.log({ count });
        for (let i = 0; i < 2; i++) {
          console.log({ i });
          if (i < 1) {
            for (let j = 0; j < oldArray.length; j++) {
              console.log({ j });
              console.log(oldArray[j]);
              this.increaseProductCount(oldArray[j]);
            }
          } else {
            for (let j = 0; j < JSON.parse(items).length; j++) {
              console.log({ j });
              console.log(JSON.parse(items)[j]);
              this.decreaseProductCount(JSON.parse(items)[j]);
            }
          }
        }
        this.getAllSalses();
      })
      .catch((error) => {
        console.log({ error });

        if (error.code == 6) {
          alert('Invoice Already Exist!');
        }
      });
  }

  deleteSales(id: string) {
    return this.storage
      .executeSql('DELETE FROM salestable WHERE id = ?;', [id])
      .then(
        () => this.getAllSalses(),
        (error) => console.error(error)
      );
  }

  // Seller

  getAllSellers() {
    return this.storage
      .executeSql('SELECT * FROM sellertable;', [])
      .then((res) => {
        const sellers: Seller[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            sellers.push({
              id: res.rows.item(i).id,
              sellerName: res.rows.item(i).sellerName,
              mobile: res.rows.item(i).mobile,
              gst: res.rows.item(i).gst,
              address1: res.rows.item(i).address1,
              disabled: true,
            });
          }
        }
        this.SellerList.next(sellers);
      });
  }

  addSeller(seller: Seller) {
    const data = [
      generateId(),
      seller.sellerName,
      seller.mobile,
      seller.gst,
      seller.address1,
    ];
    return this.storage
      .executeSql(
        'INSERT INTO sellertable (id, sellerName, mobile, gst, address1 ) VALUES (?, ?, ? , ?, ?);',
        data
      )
      .then(
        (res) => {
          this.getAllSellers();
        },
        (error) => {
          console.error({ error });

          if (error.code == 6) {
            alert('Sellere Name Already Exist!');
          }
        }
      );
  }

  updateSeller(seller: Seller) {
    return this.storage
      .executeSql(
        `UPDATE sellertable SET sellerName = ?, mobile = ? , gst = ? , address1 = ? WHERE id = ?`,
        [
          seller.sellerName,
          seller.mobile,
          seller.gst,
          seller.address1,
          seller.id,
        ]
      )
      .then((data) => {
        this.getAllSellers();
      })
      .catch((error) => {
        if (error.code == 6) {
          alert('Seller Name Already Exist!');
        }
      });
  }

  deleteSeller(id: string) {
    return this.storage
      .executeSql('DELETE FROM sellertable WHERE id = ?;', [id])
      .then(
        () => this.getAllSellers(),
        (error) => console.error(error)
      );
  }

  // Customer

  getAllCustomers() {
    return this.storage
      .executeSql('SELECT * FROM customertable;', [])
      .then((res) => {
        const customers: Customer[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            customers.push({
              id: res.rows.item(i).id,
              customerName: res.rows.item(i).customerName,
              mobile: res.rows.item(i).mobile,
              address1: res.rows.item(i).address1,
              disabled: true,
            });
          }
        }
        this.CustomerList.next(customers);
      });
  }

  getCustomer(id: string): Promise<Song> {
    return this.storage.executeSql('', [id]).then((res) => {
      return {
        id: res.rows.item(0).id,
        songName: res.rows.item(0).songName,
        artistName: res.rows.item(0).artistName,
      };
    });
  }

  addCustomer(customer: Customer) {
    const data = [
      generateId(),
      customer.customerName,
      customer.mobile,
      customer.address1,
    ];
    return this.storage
      .executeSql(
        'INSERT INTO customertable (id, customerName, mobile, address1 ) VALUES (?, ?, ? , ?);',
        data
      )
      .then(
        (res) => {
          this.getAllCustomers();
        },
        (error) => {
          console.error({ error });
          if (error.code == 6) {
            alert('Customer Name Already Exist!');
          }
        }
      );
  }

  updateCustomer(customer: Customer) {
    return this.storage
      .executeSql(
        `UPDATE customertable SET customerName = ?, mobile = ? , address1 = ? WHERE id = ?`,
        [customer.customerName, customer.mobile, customer.address1, customer.id]
      )
      .then((data) => {
        this.getAllCustomers();
      })
      .catch((error) => {
        if (error.code == 6) {
          alert('Customer Name Already Exist!');
        }
      });
  }

  deleteCustomer(id: string) {
    return this.storage
      .executeSql('DELETE FROM customertable WHERE id = ?;', [id])
      .then(
        () => this.getAllCustomers(),
        (error) => console.error(error)
      );
  }

  // Categories

  getAllCategories() {
    return this.storage
      .executeSql('SELECT * FROM categorytable;', [])
      .then((res) => {
        const categories: Category[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            categories.push({
              id: res.rows.item(i).id,
              categoryName: res.rows.item(i).categoryName,
              disabled: false,
            });
          }
        }
        this.CategoriesList.next(categories);
      });
  }

  getCategory(id: string): Promise<Category> {
    return this.storage.executeSql('', [id]).then((res) => {
      return {
        id: res.rows.item(0).id,
        categoryName: res.rows.item(0).categoryName,
        disabled: false,
      };
    });
  }

  addCategory(category: Category) {
    const data = [generateId(), category.categoryName];
    return this.storage
      .executeSql(
        'INSERT INTO categorytable (id, categoryName) VALUES (?, ?);',
        data
      )
      .then(
        () => this.getAllCategories(),
        (error) => {
          console.error(error);
          if (error.code == 6) {
            alert('Category Name Already Exist!');
          }
        }
      );
  }

  updateCategory(id: string, category: string) {
    const data = [category];
    return this.storage
      .executeSql('UPDATE categorytable SET categoryName = ? WHERE id = ?;', [
        category,
        id,
      ])
      .then(() => this.getAllCategories())
      .catch((error) => {
        if (error.code == 6) {
          alert('Category Name Already Exist!');
        }
      });
  }

  deleteCategroy(id: string) {
    return this.storage
      .executeSql('DELETE FROM categorytable WHERE id = ?;', [id])
      .then(
        () => this.getAllCategories(),
        (error) => console.error(error)
      );
  }

  deleteAllCategories() {
    return this.storage.executeSql('DELETE FROM categorytable;', []).then(
      () => this.getAllCategories(),
      (error) => console.error(error)
    );
  }

  // Products

  getAllProducts() {
    return this.storage
      .executeSql('SELECT * FROM producttable;', [])
      .then((res) => {
        const products: Product[] = [];
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            products.push({
              id: res.rows.item(i).id,
              categoryId: res.rows.item(i).categoryId,
              productName: res.rows.item(i).productName,
              gst: res.rows.item(i).gst,
              price: res.rows.item(i).price,
              quantity: res.rows.item(i).quantity,
            });
          }
        }
        this.ProductsList.next(products);
      });
  }

  getProduct(id: string): Promise<Category> {
    return this.storage.executeSql('', [id]).then((res) => {
      return {
        id: res.rows.item(0).id,
        categoryName: res.rows.item(0).categoryName,
        disabled: false,
      };
    });
  }

  getProductCount(productId: string) {
    console.log('Get Product Count in Service',productId);
    return this.storage
      .executeSql('SELECT * FROM producttable WHERE id = ?', [
        productId,
      ])
      .then(
        (res) => {
          console.log("Product Count Response:",res)
          return {
            id: res.rows.item(0).id,
            // categoryId: res.rows.item(0).categoryId,
            // productName: res.rows.item(0).productName,
            quantity: res.rows.item(0).quantity,
          };
        },
        (error) => console.log("Error in Getting Response:"+error)
      );
  }

  addProduct(product: any) {
    console.log('Product Details in Service:', product);
    const data = [
      generateId(),
      product.categoryId,
      product.productName,
      product.gst,
      product.price,
      product.quantity,
    ];
    return this.storage
      .executeSql(
        'INSERT INTO producttable (id,categoryId , productName , gst , price, quantity) VALUES (?, ?, ?, ?, ? ,?);',
        data
      )
      .then(
        (res) => {
          this.getAllProducts();
          console.log({ res });
        },
        (error) => {
          console.error(error);
          if (error.code == 6) {
            alert('Product Name Already Exist!');
          }
        }
      );
  }

  updateProduct(product: any) {
    // const data = [category];
    console.log({ product });
    return this.storage
      .executeSql(
        'UPDATE producttable SET categoryId = ?  , productName = ? , gst = ? , price = ? WHERE id = ?;',
        [
          product.categoryId,
          product.name,
          product.gst,
          product.price,
          product.id,
        ]
      )
      .then((res) => {
        console.log({ res });

        this.getAllProducts();
      })
      .catch((error) => {
        console.log({ error });
        if (error.code == 6) {
          alert('Product Name Already Exist!');
        }
      });
  }

  increaseProductCount(product: any) {
    console.log({ product });
    alert(JSON.stringify(product))
    this.getProductCount(product.productId)
    return this.storage
      .executeSql('UPDATE producttable SET  quantity = quantity + ? WHERE id = ?;', [
        product.quantity,
        product.productId,
      ])
      .then((res) => {
        console.log({ res });

        this.getAllProducts();
      })
      .catch((error) => {
        console.log({ error });
        if (error.code == 6) {
          alert('Product Name Already Exist!');
        }
      });
  }

  decreaseProductCount(product: any) {
    // const data = [category];
    console.log({ product });
    return this.storage
      .executeSql(
        'UPDATE producttable SET  quantity = quantity - ? WHERE id = ?;',
        [product.quantity, product.productId]
      )
      .then((res) => {
        console.log({ res });

        this.getAllProducts();
      })
      .catch((error) => {
        console.log({ error });
        if (error.code == 6) {
          alert('Product Name Already Exist!');
        }
      });
  }

  deleteProduct(id: string) {
    return this.storage
      .executeSql('DELETE FROM producttable WHERE id = ?;', [id])
      .then(
        () => this.getAllProducts(),
        (error) => console.error(error)
      );
  }

  deleteAllProducts() {
    return this.storage.executeSql('DELETE FROM producttable;', []).then(
      () => this.getAllProducts(),
      (error) => console.error(error)
    );
  }
}
