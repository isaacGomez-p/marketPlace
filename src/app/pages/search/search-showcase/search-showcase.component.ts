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
import { UsersService } from 'src/app/services/users.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { SubCategoriesService } from 'src/app/services/sub-categories.service';

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-search-showcase',
	templateUrl: './search-showcase.component.html',
	styleUrls: ['./search-showcase.component.css']
})
export class SearchShowcaseComponent implements OnInit {

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
	properties: Array<any> = ["category", "name", "store", "sub_category", "tags", "title_list", "url"];
	listProducts: Array<any> = [];
	tituloFound: String = 'No se encontraron productos';

	productos: any = [];
	categorias: any = [];
	subCategorias: any = [];

	constructor(private productsService: ProductsService,
		private categoriaService: CategoriesService,
		private activateRoute: ActivatedRoute,
		private usuarioService: UsersService,
		private router: Router,
		private subCategoryService: SubCategoriesService) { }

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
			this.currentRoute = `search/${this.params}`;
		} else {
			this.currentRoute = `search/${this.params}&${this.sort}`;
		}

		/*=============================================
		Filtramos data de productos con todas las propiedades
		=============================================*/
		//this.properties.forEach(property=>{		
		this.productsService.getData().subscribe(data => {
			this.categoriaService.getData().subscribe(
				dataCategoria => {
					this.categorias = dataCategoria;
					this.productos = data;
					this.productos.map((item) => {
						if (item.name.toUpperCase().includes(this.params.toUpperCase()) || item.store.toUpperCase().includes(this.params.toUpperCase())) {
							this.categorias.map((itemCate) => {
								if (item.category === itemCate.id) {									
									item.category = itemCate.url
									this.listProducts.push(item)
								}
							})
						}
					})
					if(this.listProducts.length !== 0){
						this.productsFnc(this.listProducts);
					}					
				}
			)
		})

		/*this.subCategoryService.getData().subscribe(data=>{
			this.subCategorias = data;
			this.subCategorias.map((item)=>{
				if (item.name.toUpperCase().includes(this.params.toUpperCase())) {
					this.productsService.getData().subscribe(data1=>{
						this.productos
					})
				}
			})
		})
*/
		/*this.productsService.getSearchData(property, this.params)
		.subscribe(resp=>{

			let i;
			
			for(i in resp){

				this.listProducts.push(resp[i])

			}	

			this.productsFnc(this.listProducts);

		})
		*/
		//})

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

	/*=============================================
	Declaramos función para mostrar el catálogo de productos
	=============================================*/

	productsFnc(response) {
		if (response.length > 0) {
			this.products = [];
			/*=============================================
			Hacemos un recorrido por la respuesta que nos traiga el filtrado
			=============================================*/
			let i;
			let getProducts = [];
			let total = 0;
			getProducts = response;
			for (i in response) {
				total++;
				//	getProducts.push(response[i]);						
			}

			/*=============================================
			Definimos el total de productos y la paginación de productos
			=============================================*/
			this.productFound = total;
			if (total !== 0) {
				this.tituloFound = 'productos encontrados';
			}
			this.totalPage = Math.ceil(Number(this.productFound) / 6);

			/*=============================================
			Ordenamos el arreglo de objetos lo mas actual a lo más antiguo
			=============================================*/
			if (this.sort == undefined || this.sort == "fisrt") {

				getProducts.sort(function (a, b) {
					return (b.date_created - a.date_created)
				})

				this.sortItems = [

					"Ordenar por mas nuevo",
					"Ordenar por mas antiguo",
					"Ordenar por popularidad",
					"Ordenar por precio descendente",
					"Ordenar por precio ascendente"
				]
	
				this.sortValues = [
	
					"Mas nuevo",
					"Mas antiguo",
					"Popularidad",
					"Barato",
					"Costoso"
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

					"Ordenar por mas nuevo",
					"Ordenar por mas antiguo",
					"Ordenar por popularidad",
					"Ordenar por precio descendente",
					"Ordenar por precio ascendente"
				]
	
				this.sortValues = [
	
					"Mas nuevo",
					"Mas antiguo",
					"Popularidad",
					"Barato",
					"Costoso"
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

					"Ordenar por mas nuevo",
					"Ordenar por mas antiguo",
					"Ordenar por popularidad",
					"Ordenar por precio descendente",
					"Ordenar por precio ascendente"
				]
	
				this.sortValues = [
	
					"Mas nuevo",
					"Mas antiguo",
					"Popularidad",
					"Barato",
					"Costoso"
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

					"Ordenar por mas nuevo",
					"Ordenar por mas antiguo",
					"Ordenar por popularidad",
					"Ordenar por precio descendente",
					"Ordenar por precio ascendente"
				]
	
				this.sortValues = [
	
					"Mas nuevo",
					"Mas antiguo",
					"Popularidad",
					"Barato",
					"Costoso"
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

					"Ordenar por mas nuevo",
					"Ordenar por mas antiguo",
					"Ordenar por popularidad",
					"Ordenar por precio descendente",
					"Ordenar por precio ascendente"
				]
	
				this.sortValues = [
	
					"Mas nuevo",
					"Mas antiguo",
					"Popularidad",
					"Barato",
					"Costoso"
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

						this.price.push()
						//this.price.push(DinamicPrice.fnc(getProducts[first]));

						this.cargando = false;

					}
				}

			})

		} else {

			this.cargando = false;

		}

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

				window.open(`search/${params}&${$(this).val()}`, '_top')

			})
		}
	}

	addWishList(product) {
		this.usuarioService.addWishList(product);
	}

}
