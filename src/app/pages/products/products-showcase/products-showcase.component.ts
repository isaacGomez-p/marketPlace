import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import {
	Rating,
	DinamicRating,
	DinamicReviews,
	DinamicPrice,
	Pagination,
	Select2Cofig,
	Tabs
} from '../../../functions';

import { ProductsService } from '../../../services/products.service';

import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { UsersService } from 'src/app/services/users.service';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { SubCategoriesService } from 'src/app/services/sub-categories.service';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-products-showcase',
	templateUrl: './products-showcase.component.html',
	styleUrls: ['./products-showcase.component.css']
})
export class ProductsShowcaseComponent implements OnInit {

	path: String = Path.url;
	products: Array<any> = [];
	render: Boolean = true;
	cargando: Boolean = false;
	rating: Array<any> = [];
	reviews: Array<any> = [];
	price: Array<any> = [];
	params: String = null;
	page;
	productFound: Number = 0;
	currentRoute: String = null;
	totalPage: Number = 0;
	sort;
	sortItems: Array<any> = [];
	sortValues: Array<any> = [];
	productos: any = [];
	categorias: any = [];
	categoria: number = -1;
	rutaCategoria: String = "";
	getSales = [];
	subCategorias: any = [];
	tipoBusqueda: String = 'NULL';
	subCategory: number = 0;
	constructor(private productsService: ProductsService,
		private categoriasService: CategoriesService,
		private activateRoute: ActivatedRoute,
		private usuarioService: UsersService,
		private router: Router,
		private subCategoriaService: SubCategoriesService) { }

	ngOnInit(): void {		
		this.cargando = true;

		/*=============================================
		Capturamos el parámetro URL
		=============================================*/

		this.params = this.activateRoute.snapshot.params["param"].split("&")[0];		
		this.sort = this.activateRoute.snapshot.params["param"].split("&")[1];
		this.page = this.activateRoute.snapshot.params["param"].split("&")[2];

		/*=============================================
		Evaluamos que el segundo parámetro sea de paginación
		=============================================*/
		if (Number.isInteger(Number(this.sort))) {

			this.page = this.sort;
			this.sort = undefined;

		}

		/*=============================================
		Evaluamos que el parámetro de orden no esté definido
		=============================================*/

		if (this.sort == undefined) {
			this.currentRoute = `products/${this.params}`;
		} else {
			this.currentRoute = `products/${this.params}&${this.sort}`;

		}

		this.subCategoriaService.getData().subscribe((data2) => {
			this.subCategorias = data2;
			this.subCategorias.map((itemSubCate) => {
				/*=============================================
				Se busca si el parametro pertenece a una SubCategoria
				=============================================*/
				if (itemSubCate.url === this.params) {
					this.tipoBusqueda = 'SUBCATEGORY';
					this.subCategory = itemSubCate.id
				}
			})

			if (this.tipoBusqueda === 'SUBCATEGORY') {				
				/*=============================================
				Filtramos data de productos con SubCategorías
				=============================================*/
				this.productsService.getData().subscribe(resp1 => {
					this.categoriasService.getData().subscribe(data => {
						this.categorias = data;
						this.productos = resp1;
						this.productos.map((item) => {
							if (item.sub_category === this.subCategory) {
								this.categorias.map((itemCate) => {
									if (item.category === itemCate.id) {
										item.category = itemCate.url										
										this.getSales.push(item)
									}
								})
							}
						})
						if (this.getSales.length !== 0) {
							this.productsFnc();
						}
					})
				})
			} else {

				/*=============================================
				Filtramos data de productos con categorías
				=============================================*/

				this.categoriasService.getData().subscribe(data => {
					this.categorias = data;
					this.categorias.map((itemC) => {
						if (itemC.url === this.params) {
							this.categoria = itemC.id
							this.rutaCategoria = itemC.url
							this.productsService.getData().subscribe(resp1 => {
								this.productos = resp1;
								this.productos.map((item) => {
									if (item.category === this.categoria) {
										if (Object.keys(resp1).length > 0) {
											item.category = this.rutaCategoria
											this.getSales.push(item)
										} else {
											item.category = this.rutaCategoria 			
											this.getSales.push(item)
										}
									}
								})
								if (this.getSales.length !== 0) {
									this.productsFnc();
								}
							})
						}
					})
				})

			}
		})

		/*this.productsService.getFilterData("category", this.params)
		.subscribe(resp1=>{

			if(Object.keys(resp1).length > 0){
				
				this.productsFnc(resp1);
				
			}else{

				/*=============================================
				Filtramos data de subategorías
				=============================================*/

		/*				this.productsService.getFilterData("sub_category", this.params)
						.subscribe(resp2=>{
				
							this.productsFnc(resp2);			
											
						})
		
					}
					
				})
		*/
	}

	/*=============================================
Declaramos función para mostrar el catálogo de productos
=============================================*/

	productsFnc() {

		this.products = [];

		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/
		
		let getProducts = [];
		getProducts = this.getSales;
		let total = getProducts.length;		

		/*=============================================
		Definimos el total de productos y la paginación de productos
		=============================================*/

		this.productFound = total;
		this.totalPage = Math.ceil(Number(this.productFound) / 6);

		/*=============================================
		Ordenamos el arreglo de objetos lo mas actual a lo más antiguo
		=============================================*/
		if (this.sort == undefined || this.sort == "fisrt") {

			getProducts.sort(function (a, b) {
				return (b.date_created - a.date_created)
			})

			this.sortItems = [

				"Sort by first",
				"Sort by latest",
				"Sort by popularity",
				"Sort by price: low to high",
				"Sort by price: high to low"
			]

			this.sortValues = [

				"first",
				"latest",
				"popularity",
				"low",
				"high"
			]

		}

		/*=============================================
		Ordenamos el arreglo de objetos lo mas antiguo a lo más actual
		=============================================*/

		if (this.sort == "latest") {

			getProducts.sort(function (a, b) {
				return (a.date_created - b.date_created)
			})

			this.sortItems = [

				"Sort by latest",
				"Sort by first",
				"Sort by popularity",
				"Sort by price: low to high",
				"Sort by price: high to low"
			]

			this.sortValues = [

				"latest",
				"first",
				"popularity",
				"low",
				"high"
			]

		}

		/*=============================================
		Ordenamos el arreglo de objetos lo mas visto
		=============================================*/

		if (this.sort == "popularity") {

			getProducts.sort(function (a, b) {
				return (b.views - a.views)
			})

			this.sortItems = [

				"Sort by popularity",
				"Sort by first",
				"Sort by latest",
				"Sort by price: low to high",
				"Sort by price: high to low"
			]

			this.sortValues = [

				"popularity",
				"first",
				"latest",
				"low",
				"high"
			]

		}

		/*=============================================
		Ordenamos el arreglo de objetos de menor a mayor precio
		=============================================*/

		if (this.sort == "low") {

			getProducts.sort(function (a, b) {
				return (a.price - b.price)
			})

			this.sortItems = [

				"Sort by price: low to high",
				"Sort by first",
				"Sort by latest",
				"Sort by popularity",
				"Sort by price: high to low"
			]

			this.sortValues = [

				"low",
				"first",
				"latest",
				"popularity",
				"high"
			]


		}

		/*=============================================
		Ordenamos el arreglo de objetos de mayor a menor precio
		=============================================*/

		if (this.sort == "high") {

			getProducts.sort(function (a, b) {
				return (b.price - a.price)
			})

			this.sortItems = [

				"Sort by price: high to low",
				"Sort by first",
				"Sort by latest",
				"Sort by popularity",
				"Sort by price: low to high"

			]

			this.sortValues = [

				"high",
				"first",
				"latest",
				"popularity",
				"low"

			]


		}

		/*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/

		getProducts.forEach((product, index) => {

			/*=============================================
			Evaluamos si viene número de página definida
			=============================================*/

			if (this.page == undefined) {

				this.page = 1;
			}

			/*=============================================
			Configuramos la paginación desde - hasta
			=============================================*/

			let first = Number(index) + (this.page * 6) - 6;
			let last = 6 * this.page;

			/*=============================================
			Filtramos los productos a mostrar
			=============================================*/

			if (first < last) {

				if (getProducts[first] != undefined) {

					this.products.push(getProducts[first]);

					this.rating.push(DinamicRating.fnc(getProducts[first]));

					this.reviews.push(DinamicReviews.fnc(this.rating[index]));

					//this.price.push(DinamicPrice.fnc(getProducts[first]));

					this.cargando = false;

				}
			}

		})

	}

	/*=============================================
Función que nos avisa cuando finaliza el renderizado de Angular
=============================================*/

	callback(params) {

		if (this.render) {

			this.render = false;

			Rating.fnc();
			Pagination.fnc();
			Select2Cofig.fnc();
			Tabs.fnc();

			/*=============================================
		Captura del Select Sort Items
		=============================================*/

			$(".sortItems").change(function () {

				window.open(`products/${params}&${$(this).val()}`, '_top')

			})
		}
	}

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
