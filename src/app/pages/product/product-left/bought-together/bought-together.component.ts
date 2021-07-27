import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { Path } from '../../../../config';
import { DinamicPrice } from '../../../../functions';

import { ProductsService } from '../../../../services/products.service';
import { UsersService } from '../../../../services/users.service';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-bought-together',
	templateUrl: './bought-together.component.html',
	styleUrls: ['./bought-together.component.css']
})
export class BoughtTogetherComponent implements OnInit {

	@Input() childItem: any;

	path: String = Path.url;
	products: Array<any> = [];
	productsCarrito: Array<any> = [];
	price: Array<any> = [];
	render: Boolean = true;
	productos = [];
	categorias: any = []
	constructor(private productsService: ProductsService,
		private categoriaService: CategoriesService,
		private usersService: UsersService,
		private router: Router) { }

	ngOnInit(): void {

		this.productsService.getData().subscribe(resp => {
			this.productsFnc(resp);
		})
		/*this.productsService.getFilterData("title_list", this.childItem["title_list"])	
		.subscribe( resp => {
			
			this.productsFnc(resp);

		})*/

	}

	/*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/

	productsFnc(response) {

		this.categoriaService.getData().subscribe(data => {
			this.categorias = data;


			this.products.push(this.childItem);

			/*=============================================
			Hacemos un recorrido por la respuesta que nos traiga el filtrado
			=============================================*/

			let i;
			let getProduct = [];

			for (i in response) {
				if (this.childItem["name"] != response[i]["name"]) {
					if (this.childItem["title_list"] == response[i]["title_list"]) {
						this.categorias.map((item)=>{
							if(item.id === response[i].category){
								response[i].category = item.url
								getProduct.push(response[i]);
							}
						})
						
					}
				}
			}

			/*=============================================
			Ordenamos de mayor a menor vistas el arreglo de objetos
			=============================================*/

			getProduct.sort(function (a, b) {
				return (b.views - a.views)
			})

			/*=============================================
			Filtramos solo 1 producto
			=============================================*/

			getProduct.forEach((product, index) => {
				if (index == 0) {
					this.products.push(product);
					return;
				}
			})

			for (const i in this.products) {

				/*=============================================
				Price
				=============================================*/
				this.price.push(DinamicPrice.fnc(this.products[i]));

			}
		});
	}

	callback() {


		if (this.render) {

			this.render = false;

			let price = $(".endPrice .end-price");

			let total = 0;

			for (let i = 0; i < price.length; i++) {

				total += Number($(price[i]).html())

			}

			$(".ps-block__total strong").html(`$${total.toFixed(2)}`)
		}
	}

	addWishlist(response) {

		this.usersService.addWishList(response[0]);

		let localUsersService = this.usersService;

		setTimeout(function () {
			if (response[1] != undefined) {
				localUsersService.addWishList(response[1]);
			}

		}, 1000)

	}

	/*=============================================
		Función para agregar productos al carrito de compras
		=============================================*/

	addShoppinCart(product, unit, details) {
		let url = this.router.url;
		this.productsCarrito = product;
		this.productsCarrito.map((item) => {
			let item1 = new CarritoComprasModel();
			item1 = {
				details: details,
				product: item.id,
				unit: unit,
				url: url
			}
			this.usersService.addShoppinCart(item1)
		})




		/*let item2 = new CarritoComprasModel();
		item2 = {
			details: details2,
			product: product2,
			unit: unit2,
			url: url
		}
		this.usersService.addShoppinCart(item2)*/
	}

}
