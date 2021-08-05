import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

import {
	OwlCarouselConfig,
	CarouselNavigation,
	Rating,
	DinamicRating,
	DinamicReviews,
	DinamicPrice
} from '../../../functions';

import { ProductsService } from '../../../services/products.service';

import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { UsersService } from 'src/app/services/users.service';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { SubCategoriesService } from 'src/app/services/sub-categories.service';

@Component({
	selector: 'app-products-recommended',
	templateUrl: './products-recommended.component.html',
	styleUrls: ['./products-recommended.component.css']
})
export class ProductsRecommendedComponent implements OnInit {

	path: String = Path.url;
	recommendedItems: Array<any> = [];
	render: Boolean = true;
	rating: Array<any> = [];
	reviews: Array<any> = [];
	price: Array<any> = [];
	cargando: Boolean = false;

	productos: any = [];
	subCategorias: any = [];
	categorias: any = [];
	categoria: number = 0;
	rutaCategoria: String = "";
	getSales = [];
	constructor(private productsService: ProductsService,
		private categoriasService: CategoriesService,
		private activateRoute: ActivatedRoute,
		private usuarioService: UsersService,
		private router: Router,
		private subCategory: SubCategoriesService) { }

	ngOnInit(): void {

		this.cargando = true;

		/*=============================================
		Capturamos el parámetro URL
		=============================================*/

		let params = this.activateRoute.snapshot.params["param"].split("&")[0];
		let tipoBusqueda = 'NULL';
		let idSubCategoria = 0;
		this.subCategory.getData().subscribe((data2) => {
			this.subCategorias = data2
			/*=============================================
			Se busca si el parametro pertenece a una SubCategoria
			=============================================*/
			this.subCategorias.map((itemSubCat) => {
				if (itemSubCat.url === params) {
					tipoBusqueda = 'SUBCATEGORIAS'
					idSubCategoria = itemSubCat.id
				}
			})
			if (tipoBusqueda === 'SUBCATEGORIAS') {
				/*=============================================
				Filtramos data de productos con SubCategorías
				=============================================*/		
				this.productsService.getData().subscribe(resp1 => {
					this.categoriasService.getData().subscribe(data => {
						this.categorias = data;
						this.productos = resp1;
						this.productos.map((item) => {
							if (item.sub_category === idSubCategoria) {
								this.categorias.map((itemCate)=>{
									if(item.category === itemCate.id){
										item.category = itemCate.url
										this.getSales.push(item)
									}
								})
							}
						})
						if(this.getSales.length !== 0){
							this.productsFnc()
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
						if (itemC.url === params) {
							this.categoria = itemC.id
							this.rutaCategoria = itemC.url
						}
					})
					this.productsService.getData().subscribe(resp1 => {
						this.productos = resp1;
						this.productos.map((item) => {
							if (item.category === this.categoria) {
								if (Object.keys(resp1).length > 0) {
									item.category = this.rutaCategoria
									this.getSales.push(item)
									//this.productsFnc(resp1);

								} else {
									//this.productsFnc(resp1);


									/*this.productsService.getFilterData("sub_category", params)
										.subscribe(resp2=>{		
											
											this.productsFnc(resp2);			
											
										})
						
									}*/
								}
							}
						})

						if (this.getSales.length !== 0) {
							this.productsFnc()
						}

					})
				})
			}
		})


		/*this.productsService.getFilterData("category", params)
		.subscribe(resp1=>{

			if(Object.keys(resp1).length > 0){
		
				this.productsFnc(resp1);
							
			}else{

				/*=============================================
				Filtramos data de subategorías
				=============================================*/

		/*		this.productsService.getFilterData("sub_category", params)
				.subscribe(resp2=>{		
					
					this.productsFnc(resp2);			
					
				})

			}
			
		})*/

	}

	/*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/

	productsFnc() {

		this.recommendedItems = [];

		/*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/

		this.getSales.sort(function (a, b) {
			return (b.views - a.views)
		})

		/*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/

		this.getSales.forEach((product, index) => {

			if (index < 10) {

				this.recommendedItems.push(product);

				this.rating.push(DinamicRating.fnc(this.recommendedItems[index]));

				this.reviews.push(DinamicReviews.fnc(this.rating[index]));

				this.price.push(DinamicPrice.fnc(this.recommendedItems[index]));

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
