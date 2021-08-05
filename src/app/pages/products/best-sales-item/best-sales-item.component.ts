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
import { SubCategoriesService } from 'src/app/services/sub-categories.service';

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
	subCategorias: any = [];
	tipoBusqueda: String = 'NULL';
	subCategory: number = 0;
	getSales = [];
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

		let params = this.activateRoute.snapshot.params["param"].split("&")[0];
		let validacion = false;

		this.subCategoriaService.getData().subscribe((data2) => {
			this.subCategorias = data2;
			this.subCategorias.map((itemSubCate) => {
				/*=============================================
				Se busca si el parametro pertenece a una SubCategoria
				=============================================*/
				if (itemSubCate.url === params) {
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
								this.categorias.map((itemCate)=>{									
									if(item.category === itemCate.id){										
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
									validacion = true;
									item.category = this.rutaCategoria;
									this.getSales.push(item)
									//this.productsFnc(resp1);
								} else {
									validacion = true;
									item.category = this.rutaCategoria;
									this.getSales.push(item)
									//this.productsFnc(resp1);
								}
							}
						})
						if (validacion === false) {
							this.subCategoriaService.getData().subscribe(data => {
								this.subCategorias = data;
								this.subCategorias.map((itemSub) => {
									if (itemSub.url === params) {
										this.categoria = itemSub.id
										this.rutaCategoria = itemSub.url
									}
								})
								this.productos.map((itemProductos) => {
									if (itemProductos.sub_category === this.categoria) {
										//this.productsFnc(resp1);
										this.getSales.push(itemProductos)
									}
								})
							})
						}
						if (this.getSales.length !== 0) {
							this.productsFnc();
						}
					})
				})
			}
		});		
	}

	/*=============================================
	Declaramos función para mostrar las mejores ventas
	=============================================*/
	
	productsFnc() {
		
		this.bestSalesItem = [];
		
		/*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/

		this.getSales.sort(function (a, b) {
			return (b.sales - a.sales)
		})

		/*=============================================
		Filtramos solo hasta 5 productos
		=============================================*/

		this.getSales.forEach((product, index) => {

			if (index < 8) {

				this.bestSalesItem.push(product);

				this.rating.push(DinamicRating.fnc(this.bestSalesItem[index]));

				this.reviews.push(DinamicReviews.fnc(this.rating[index]));

				this.price.push(DinamicPrice.fnc(this.bestSalesItem[index]));

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
