import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { Path } from '../../config';
import { Search, DinamicPrice,Sweetalert } from '../../functions';
import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { Router } from '@angular/router'

declare var jQuery: any;
declare var $: any;

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	path: String = Path.url;
	categories: Object = null;
	arrayTitleList: Array<any> = [];
	render: Boolean = true;
	authValidate: boolean = false;
	picture: String;
	usuarios: any = [];
	productos: any = [];
	shoppingCart: any[] = [];
	wishList: number = 0;
	totalShoppingCart: number = 0;
	categorias: any = [];
	renderShopping: Boolean = true;
	cantidadShopping: number = 0;
	subTotal:string = `<h3>Sub Total:<strong class="subTotalHeader"><div class="spinner-border"></div></strong></h3>`;
	constructor(private categoriesService: CategoriesService,
		private subCategoriesService: SubCategoriesService,
		private serviceUsuario: UsersService,
		private productsService: ProductsService,
		private router: Router) { }

	ngOnInit(): void {		
		if (localStorage.getItem("idToken") !== null) {			
			if (localStorage.getItem("email") !== null) {				
				this.serviceUsuario.loginAux().subscribe(data => {					
					this.usuarios = data;
					this.usuarios.map((item) => {						
						if (item.email === localStorage.getItem("email")) {
							if(item.city !== "city"){							
								this.wishList = Number(JSON.parse(item.city).length)
							}
							
							this.authValidate = true;
							if (item.state !== 'state') {
								this.picture = `<img src="assets/img/users/` + item.username.toLowerCase() + `/` + item.state + `" class="img-fluid rounded-circle ml-auto">`;
							} else {
								this.picture = `<img src="assets/img/users/default/default.png" class="img-fluid rounded-circle ml-auto">`;
							}
						}
					})
				});
			}else{
				this.authValidate = false;
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
						this.productos.map((itemPoductos)=>{
							if(itemCarrito.product === itemPoductos.id){
								this.categorias.map((itemCategorias)=>{
									if(itemCategorias.id === itemPoductos.category){
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
									price: DinamicPrice.fnc(itemPoductos)[0],
									shipping: itemPoductos.shipping * itemCarrito.unit
								})
								this.cantidadShopping = this.cantidadShopping + itemPoductos.price * itemCarrito.unit
								this.cantidadShopping.toFixed(2)
							}
						})
					})
				})
			}
		}else{
			this.authValidate = false;
		}

		/*=============================================
		Tomamos la data de las categorías
		=============================================*/

		this.categoriesService.getData()
			.subscribe(resp => {

				this.categories = resp;

				/*=============================================
				Recorremos la colección de categorías para tomar la lista de títulos
				=============================================*/

				let i;

				for (i in resp) {

					/*=============================================
					Separamos la lista de títulos en índices de un array
					=============================================*/

					this.arrayTitleList.push(JSON.parse(resp[i].title_list));

				}

			})

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
	Función para eliminar el producto del carrito
	=============================================*/

	removeProduct(product){
		if(localStorage.getItem("list")){
			let shoppingCart = JSON.parse(localStorage.getItem("list"))
			shoppingCart.forEach((list, index)=>{
				if(list.product === product){
					shoppingCart.splice(index, 1);
				}
			})
			localStorage.setItem("list", JSON.stringify(shoppingCart))			
			Sweetalert.fnc("success", "Producto eliminado.", this.router.url);
		}

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback() {

		if (this.render) {

			this.render = false;
			let arraySubCategories = [];

			/*=============================================
			Hacemos un recorrido por la lista de títulos
			=============================================*/

			this.arrayTitleList.forEach(titleList => {

				/*=============================================
				Separar individualmente los títulos
				=============================================*/

				for (let i = 0; i < titleList.length; i++) {

					/*=============================================
					Tomamos la colección de las sub-categorías filtrando con la lista de títulos
					=============================================*/

					this.subCategoriesService.getFilterData("title_list", titleList[i])
						.subscribe(resp => {

							arraySubCategories.push(resp);

							/*=============================================
							Hacemos un recorrido por la colección general de subcategorias
							=============================================*/

							let f;
							let g;
							let arrayTitleName = [];

							for (f in arraySubCategories) {

								/*=============================================
								Hacemos un recorrido por la colección particular de subcategorias
								=============================================*/

								for (g in arraySubCategories[f]) {
									let validacion = false;
									/*=============================================
									Creamos un nuevo array de objetos clasificando cada subcategoría con la respectiva lista de título a la que pertenece
									=============================================*/
									arrayTitleName.map((item) => {
										if (item.subcategory === arraySubCategories[f][g].name && item.titleList === arraySubCategories[f][g].title_list) {
											validacion = true;
										}
									})
									if (validacion === false) {


										arrayTitleName.push({

											"titleList": arraySubCategories[f][g].title_list,
											"subcategory": arraySubCategories[f][g].name,
											"url": arraySubCategories[f][g].url,

										})
									}

								}

							}

							/*=============================================
							Recorremos el array de objetos nuevo para buscar coincidencias con las listas de título
							=============================================*/

							for (f in arrayTitleName) {

								if (titleList[i] == arrayTitleName[f].titleList) {

									/*=============================================
									Imprimir el nombre de subcategoría debajo de el listado correspondiente
									=============================================*/

									$(`[titleList='${titleList[i]}']`).append(

										`<li>
										<a href="products/${arrayTitleName[f].url}">${arrayTitleName[f].subcategory}</a>
									</li>`

									)

								}

							}

						})

				}

			})
		}

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callbackShopping(){

		if(this.renderShopping){

			this.renderShopping = false;

			/*=============================================
			Sumar valores para el precio total
			=============================================*/

			let totalProduct = $(".ps-product--cart-mobile");

			setTimeout(function(){

				let price = $(".pShoppingHeader .end-price")
				let quantity = $(".qShoppingHeader");
				let shipping = $(".sShoppingHeader");

				let totalPrice = 0;

				for(let i = 0; i < price.length; i++){
									
					/*=============================================
					Sumar precio con envío
					=============================================*/

					let shipping_price = Number($(price[i]).html()) + Number($(shipping[i]).html());
					
					totalPrice +=  Number($(quantity[i]).html() * shipping_price)
		
				}

				$(".subTotalHeader").html(`$${totalPrice.toFixed(2)}`)

			},totalProduct.length * 500)

		}

	}



}
