import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import {
	OwlCarouselConfig,
	CarouselNavigation,
	Rating,
	DinamicRating,
	DinamicReviews,
	DinamicPrice,
	Sweetalert
} from '../../../functions';

import { ProductsService } from '../../../services/products.service';

import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { UsersService } from 'src/app/services/users.service';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-best-sales-item',
	templateUrl: './best-sales-item.component.html',
	styleUrls: ['./best-sales-item.component.css']
})
export class BestSalesItemComponent implements OnInit {

	path: String = Path.url;
	bestSalesItem: Array<any> = [];
	render: Boolean = true;
	rating: Array<any> = [];
	reviews: Array<any> = [];
	price: Array<any> = [];
	cargando: Boolean = false;

	productos: any = [];
	categorias: any = [];
	rutaCategoria: String = "";
	categoria: number = 0;
	usuarios: any = [];
	constructor(private productsService: ProductsService,
		private categoriasService: CategoriesService,
		private activateRoute: ActivatedRoute,
		private usuarioService: UsersService,
		private router: Router) { }

	ngOnInit(): void {

		this.cargando = true;

		/*=============================================
	Capturamos el parámetro URL
	=============================================*/

		let params = this.activateRoute.snapshot.params["param"].split("&")[0];

		/*=============================================
		Filtramos data de productos con categorías
		=============================================*/

		this.categoriasService.getData().subscribe(data => {
			this.categorias = data;
			this.categorias.map((itemC) => {
				if (itemC.url === params) {
					this.categoria = itemC.id
					this.rutaCategoria = itemC.url
				}
			})
		})

		this.productsService.getData().subscribe(resp1 => {
			this.productos = resp1;
			this.productos.map((item) => {
				if (item.category === this.categoria) {
					if (Object.keys(resp1).length > 0) {
						this.productsFnc(resp1);
					} else {

						/*=============================================
						Filtramos data de subategorías
						=============================================*/
						this.productsFnc(resp1);
						/*this.productsService.getFilterData("sub_category", params)
						.subscribe(resp2=>{
				
							this.productsFnc(resp2);			
							
						})
						*/
					}
				}
			})



		})
		this.productsService.getFilterData("category", params)
			.subscribe(resp1 => {

				if (Object.keys(resp1).length > 0) {

					this.productsFnc(resp1);

				} else {

					/*=============================================
					Filtramos data de subategorías
					=============================================*/

					this.productsService.getFilterData("sub_category", params)
						.subscribe(resp2 => {

							this.productsFnc(resp2);

						})

				}

			})

	}

	/*=============================================
Declaramos función para mostrar las mejores ventas
=============================================*/

	productsFnc(response) {

		this.bestSalesItem = [];

		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/

		let i;
		let getSales = [];

		for (i in response) {
			if (this.categoria === response[i].category) {
				response[i].category = this.rutaCategoria
				getSales.push(response[i]);
			}

		}

		/*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/

		getSales.sort(function (a, b) {
			return (b.sales - a.sales)
		})

		/*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/

		getSales.forEach((product, index) => {

			if (index < 10) {

				this.bestSalesItem.push(product);

				this.rating.push(DinamicRating.fnc(this.bestSalesItem[index]));

				this.reviews.push(DinamicReviews.fnc(this.rating[index]));

				//this.price.push(DinamicPrice.fnc(this.bestSalesItem[index]));

				this.cargando = false;

			}

		})

	}

	/*=============================================
  Función que nos avisa cuando finaliza el renderizado de Angular
  =============================================*/

	callback() {

		if (this.render) {

			this.render = false;

			OwlCarouselConfig.fnc();
			CarouselNavigation.fnc();
			Rating.fnc();

		}

	}

	/*=============================================
	Función para agregar productos a la lista de deseos
	=============================================*/
	addWishList(product) {
		this.usuarioService.addWishList(product);
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
		this.usuarioService.addShoppinCart(item)
	}
}
