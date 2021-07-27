import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { Path } from '../../config';
import { Search } from '../../functions';
import { Sweetalert } from '../../functions';

declare var jQuery: any;
declare var $: any;

import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';

@Component({
	selector: 'app-header-mobile',
	templateUrl: './header-mobile.component.html',
	styleUrls: ['./header-mobile.component.css']
})

export class HeaderMobileComponent implements OnInit {

	path: String = Path.url;
	categories: Object = null;
	render: Boolean = true;
	categoriesList: Array<any> = [];
	authValidate: boolean = false;
	picture: String;
	usuarios: any = [];

	shoppingCart: any[] = [];
	wishList: number = 0;
	totalShoppingCart: number = 0;
	categorias: any = [];
	renderShopping: Boolean = true;
	cantidadShopping: number = 0;
	productos: any = [];
	
	constructor(private categoriesService: CategoriesService,
		private subCategoriesService: SubCategoriesService,
		private serviceUsuario: UsersService,
		private router: Router,
		private productsService: ProductsService) { }

	ngOnInit(): void {
		if (localStorage.getItem("idToken") !== undefined) {
			if (localStorage.getItem("email") !== undefined) {
				this.serviceUsuario.loginAux().subscribe(data => {
					this.usuarios = data;
					this.usuarios.map((item) => {
						if (item.email === localStorage.getItem("email")) {
							this.authValidate = true;
							if (item.state !== 'state') {
								this.picture = `<img src="assets/img/users/` + item.username.toLowerCase() + `/` + item.state + `" class="img-fluid rounded-circle ml-auto">`;
							} else {
								this.picture = `<img src="assets/img/users/default/default.png" class="img-fluid rounded-circle ml-auto">`;
							}
						}
					})
				});
			}
		}

		/*=============================================
			Productos en el carrito de compras en el localStorage
			=============================================*/
		this.categoriesService.getData().subscribe((dataCategoria) => {
			this.categorias = dataCategoria;
		})
		if (localStorage.getItem("list")) {
			this.productsService.getData().subscribe(data => {
				this.productos = data;
				let list = JSON.parse(localStorage.getItem("list"));
				this.totalShoppingCart = list.length
				list.map((itemCarrito) => {
					this.productos.map((itemPoductos) => {
						if (itemCarrito.product === itemPoductos.id) {
							this.categorias.map((itemCategorias) => {
								if (itemCategorias.id === itemPoductos.category) {
									itemPoductos.category = itemCategorias.url
								}
							})
							this.shoppingCart.push({
								idProducto: itemPoductos.id,
								category: itemPoductos.category,
								url: itemPoductos.url,
								name: itemPoductos.name,
								image: itemPoductos.image,
								delivery_time: itemPoductos.delivery_time,
								quantity: itemCarrito.unit,
								price: (itemPoductos.price * itemCarrito.unit).toFixed(2)
							})
							this.cantidadShopping = this.cantidadShopping + itemPoductos.price * itemCarrito.unit
							this.cantidadShopping.toFixed(2)
						}
					})
				})
			})
		}

		/*=============================================
		Tomamos la data de las categorías
		=============================================*/

		this.categoriesService.getData()
			.subscribe(resp => {

				this.categories = resp;

				/*=============================================
				Recorrido por el objeto de la data de categorías
				=============================================*/
				let i;
				for (i in resp) {

					/*=============================================
					Separamos los nombres de categorías
					=============================================*/

					this.categoriesList.push(
						{
							"name": resp[i].name,
							"id": resp[i].id
						}
					)
				}
			})

		/*=============================================
		Activamos el efecto toggle en el listado de subcategorías
		=============================================*/

		$(document).on("click", ".sub-toggle", function () {

			$(this).parent().children('ul').toggle();

		})

	}

	/*=============================================
	Función para eliminar el producto del carrito
	=============================================*/

	removeProduct(product) {
		if (localStorage.getItem("list")) {
			let shoppingCart = JSON.parse(localStorage.getItem("list"))
			shoppingCart.forEach((list, index) => {
				if (list.product === product) {
					shoppingCart.splice(index, 1);
				}
			})
			localStorage.setItem("list", JSON.stringify(shoppingCart))
			Sweetalert.fnc("success", "Producto eliminado.", this.router.url);
		}

	}

	/*=============================================
	Declaramos función del buscador
	=============================================*/

	goSearch(search: String) {

		if (search.length == 0 || Search.fnc(search) == undefined) {

			return;
		}

		window.open(`search/${Search.fnc(search)}`, '_top')

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback() {

		if (this.render) {

			this.render = false;
			let arraySubCategories = [];

			/*=============================================
			Separar las categorías
			=============================================*/

			this.categoriesList.forEach(category => {

				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/

				this.subCategoriesService.getFilterData("category", category)
					.subscribe(resp => {

						/*=============================================
						Hacemos un recorrido por la colección general de subcategorias y clasificamos las subcategorias y url
						de acuerdo a la categoría que correspondan
						=============================================*/
						let i;
						for (i in resp) {
							let validacion = true;
							/*=============================================
							Creamos un nuevo array de objetos clasificando cada subcategoría con la respectiva lista de título a la que pertenece
							=============================================*/
							arraySubCategories.map((item) => {
								if (item.id === resp[i].id) {
									validacion = false;
								}
							})
							if (validacion === true) {
								arraySubCategories.push({
									"id": resp[i].id,
									"category": resp[i].category,
									"subcategory": resp[i].name,
									"url": resp[i].url
								})
							}
						}

						/*=============================================
						Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
						=============================================*/
						arraySubCategories.map((item) => {
							if (category.id === item.category) {
								$(`[category='${category.id}']`).append(
									`<li class="current-menu-item ">
		                        	<a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a>
		                        </li>`
								)
							}
						})

						/*for (i in arraySubCategories) {
							if (category == arraySubCategories[i].category) {
								$(`[category='${category}']`).append(
									`<li class="current-menu-item ">
									<a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a>
								</li>`
								)
							}
						}*/
					})
			})
		}
	}
}