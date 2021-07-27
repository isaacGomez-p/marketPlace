import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Path } from '../../../../config';

import { DinamicPrice, Sweetalert } from '../../../../functions';

import { UsersService } from '../../../../services/users.service';
import { ProductsService } from '../../../../services/products.service';

import { Subject } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { UsersModel } from 'src/app/models/users.model';

import notie from 'notie';
import { confirm } from 'notie';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-account-wishlist',
  templateUrl: './account-wishlist.component.html',
  styleUrls: ['./account-wishlist.component.css']
})
export class AccountWishlistComponent implements OnInit, OnDestroy {

  @Input() childItem: any;

  path: string = Path.url;
  wishlist: any = [];
  products: any[] = [];
  price: any[] = [];
  render: boolean = true;

  usuarios: any = [];
  productosAll: any = [];
  categoriasAll: any = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  usuario: number = 0;

  popoverMessage: string = '¿Desea eliminar el producto?';

  constructor(private usersService: UsersService,
    private productsService: ProductsService,
    private categoriaService: CategoriesService,
    private router: Router) { }

  ngOnInit(): void {
    /*=============================================
    Agregamos opciones a DataTable
    =============================================*/

    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true
    }

    /*=============================================
    Seleccionamos el id del usuario
    =============================================*/
    this.usersService.loginAux().subscribe(data => {
      this.usuarios = data;
      this.usuarios.map((item) => {
        if (item.id === this.childItem) {
          this.usuario = item.id
          try {
            this.wishlist = JSON.parse(item.city);

            let load = 0;

            if (this.wishlist.length > 0) {
              this.productsService.getData().subscribe(data => {
                this.productosAll = data;
                console.log("1 ---- ");
                this.wishlist.map((itemDeseos) => {
                  this.productosAll.map((itemProductos) => {
                    console.log("2 ---- ");
                    if (itemDeseos.id === itemProductos.id + "") {
                      console.log("3 ---- ");
                      /*=============================================
                      agregamos los productos 
                      =============================================*/
                      this.categoriaService.getData().subscribe((dataCategorias) => {
                        this.categoriasAll = dataCategorias;
                        this.categoriasAll.map((itemCategorias) => {
                          if (itemCategorias.id === itemProductos.category) {
                            if (itemCategorias.url === 'consumer-electrict') {
                              itemProductos.category = 'consumer-electric';
                            } else {
                              itemProductos.category = itemCategorias.url
                            }
                            if (itemProductos.category === 'home-kitchen') {
                              itemProductos.image = '1.jpg';
                            }
                            this.products.push(itemProductos);
                            /*=============================================
                              validamos los precios en oferta
                            =============================================*/

                            this.price.push(itemProductos.price)

                            if (load == this.wishlist.length) {

                              this.dtTrigger.next();

                            }
                          }
                        });

                      });

                    }
                  })
                })

              })

            }
          }
          catch (exception) {
            console.log(exception);
          }

        }
      })
    })
    /*  this.usersService.getUniqueData(this.childItem)
        .subscribe(resp => {
  
          if (resp["wishlist"] != undefined) {
  
            /*=============================================
            Tomamos de la data la lista de deseos
            =============================================*/

    /*       this.wishlist = JSON.parse(resp["wishlist"]);
 
           let load = 0;
 
           /*=============================================
           Realizamos un foreach en la lista de deseos
           =============================================*/

    /*   if (this.wishlist.length > 0) {

         this.wishlist.forEach(list => {

           /*=============================================
             Filtramos la data de productos 
           =============================================*/

    /*     this.productsService.getFilterData("url", list)
           .subscribe(resp => {

             /*=============================================
             recorremos la data de productos
             =============================================*/

    /*         for (const i in resp) {

               load++;

               /*=============================================
               agregamos los productos 
               =============================================*/
    /*
                        this.products.push(resp[i]);
    
                        /*=============================================
                          validamos los precios en oferta
                        =============================================*/
    /*
                        this.price.push(DinamicPrice.fnc(resp[i]))
    
                        /*=============================================
                        preguntamos cuando termina de cargar toda la data en el DOM
                        =============================================*/

    /*       if (load == this.wishlist.length) {

             this.dtTrigger.next();

           }

         }

       })

   })

 }

}

})
*/
  }

  /*=============================================
  Removemos el producto de la lista de deseos
  =============================================*/

  removeProduct(product) {
    console.log("entro " + product);
    let provisional = []
    /*=============================================
    Buscamos coincidencia para remover el producto
    =============================================*/
    this.wishlist.map((item) => {
      if (item.id + "" !== product + "") {
        console.log("agrego");
        provisional.push(item);
      }
    })
    console.log("salio " + JSON.stringify(provisional));
    this.wishlist = provisional
    let us: UsersModel;
    this.usersService.loginAux().subscribe(data => {
      this.usuarios = data;
      this.usuarios.map(item => {
        if (item.id === this.usuario) {
          us = item
          us.city = JSON.stringify(this.wishlist)
          this.usersService.changePasswordFnc(us).subscribe(dataU => {
            Sweetalert.fnc("success", "Producto eliminado", "account")
          });
        }
      })
    })

    /*this.wishlist.forEach((list, index) => {

      if (list == product) {

        this.wishlist.splice(index, 1);

      }

    })
    */
    /*=============================================
    Actualizamos en Firebase la lista de deseos
    =============================================*/

    /*let body = {

      wishlist: JSON.stringify(this.wishlist)

    }



    this.usersService.patchData(this.childItem, body)
      .subscribe(resp => {

        if (resp["wishlist"] != "") {

          Sweetalert.fnc("success", "Product removed", "account")

        }

      })
    */
  }

  /*=============================================
  Callback
  =============================================*/
  callback() {

    if (this.render) {

      this.render = false;

      if (window.matchMedia("(max-width:991px)").matches) {

        let localWishlist = this.wishlist;
        let localUsersService = this.usersService;
        let users = this.usuarios
        let title = this.popoverMessage
        //let localChildItem = this.childItem;
        let localChildItem = this.usuario;

        $(document).on("click", ".removeProduct", function () {

          let product = $(this).attr("remove");

          notie.confirm({

            text: title,
            cancelCallback: function () {
              return;
            },
            submitCallback: function () {
              let provisional = []
              /*=============================================
              Buscamos coincidencia para remover el producto
              =============================================*/
              localWishlist.map((item) => {
                if (item.id + ""! == product.id + "") {
                  provisional.push(item);
                }
              })
              localWishlist = provisional
              let us: UsersModel;
              localUsersService.loginAux().subscribe(data => {
                users = data;
                users.map(item => {
                  if (item.id === localChildItem) {
                    us = item
                    us.city = JSON.stringify(localWishlist)
                    localUsersService.changePasswordFnc(us).subscribe(dataU => {
                      Sweetalert.fnc("success", "Producto eliminado", "account")
                    });
                  }
                })
              })

              /*=============================================
              Buscamos coincidencia para remover el producto
              =============================================*/

              /*   localWishlist.forEach((list, index)=>{
                   
                   if(list == product){
    
                     localWishlist.splice(index, 1);
    
                   }
    
                 })
    
                 /*=============================================
                 Actualizamos en Firebase la lista de deseos
                 =============================================*/

              /*   let body ={
    
                   wishlist: JSON.stringify(localWishlist)
                 
                 }
    
                 localUsersService.patchData(localChildItem, body)
                 .subscribe(resp=>{
    
                     if(resp["wishlist"] != ""){
    
                       Sweetalert.fnc("success", "Product removed", "account")
    
                     }
    
                 })
                */
            }

          })

        })

      }

    }

  }

  /*=============================================
  Destruímos el trigger de angular
  =============================================*/

  ngOnDestroy(): void {

    this.dtTrigger.unsubscribe();

  }

  /*=============================================
  Función para agregar productos al carrito de compras
  =============================================*/

  addShoppinCart(product, unit, details) {
    let url = this.router.url;
    let item = new CarritoComprasModel();
    item = {
      details: details,
      product: product,
      unit: unit,
      url: url
    }
    this.usersService.addShoppinCart(item)
  }

}
