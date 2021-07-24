import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import {
	Rating,
	DinamicRating,
	DinamicReviews,
	DinamicPrice,
	CountDown,
	ProgressBar,
	Tabs,
	SlickConfig,
	ProductLightbox,
	Quantity
} from '../../../functions';

import { ActivatedRoute } from '@angular/router';

import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
	selector: 'app-product-left',
	templateUrl: './product-left.component.html',
	styleUrls: ['./product-left.component.css']
})
export class ProductLeftComponent implements OnInit {

	path: String = Path.url;
	product: Array<any> = [];
	rating: Array<any> = [];
	reviews: Array<any> = [];
	price: Array<any> = [];
	cargando: Boolean = false;
	render: Boolean = true;
	countd: Array<any> = [];
	gallery: Array<any> = [];
	renderGallery: Boolean = true;
	video: string = null;
	tags: String = null;
	totalReviews: String;
	url: string = "";
	categorias: any = [];
	constructor(private activateRoute: ActivatedRoute,
		private productsService: ProductsService,
		private categoriaService: CategoriesService) { }

	ngOnInit(): void {
		this.url = this.activateRoute.snapshot.params["param"];
		this.cargando = true;
		this.productsService.getData().subscribe(data => {
			this.productsFnc(data);
		});
		/*this.productsService.getFilterData("url", this.activateRoute.snapshot.params["param"])  
		.subscribe( resp => {
			
			this.productsFnc(resp);		

		})*/

	}

	/*=============================================
	  Declaramos función para mostrar los productos recomendados
	  =============================================*/

	productsFnc(response) {

		this.product = [];

		/*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/

		let i;
		let getProduct = [];
		console.log("--- productos " + JSON.stringify(response));
		this.categoriaService.getData().subscribe(data => {
			this.categorias = data;
			for (i in response) {
				if (this.url === response[i].url) {
					this.categorias.map((item) => {
						console.log("--- item.id " + (item.id) + " -- " + response[i].category);
						if (item.id === response[i].category) {
							response[i].category = item.url
							getProduct.push(response[i]);
							console.log("agrego --- ")
						}
						console.log("sale 1 --- ")
					})
					console.log("sale 2 --- ")
					console.log("sale 3 --- ")

				}
				console.log("sale 4 --- ")
			}



			/*=============================================
			Filtramos el producto
			=============================================*/
			console.log("1 --- ")
			getProduct.forEach((product, index) => {
				console.log("2 --- ")
				this.product.push(product);

				this.rating.push(DinamicRating.fnc(this.product[index]));

				this.reviews.push(DinamicReviews.fnc(this.rating[index]));

				//this.price.push(DinamicPrice.fnc(this.product[index]));

				/*=============================================
				Agregamos la fecha al descontador
				=============================================*/

				if (this.product[index].offer != "") {

					const date = JSON.parse(this.product[index].offer)[2];

					this.countd.push(

						new Date(
							/*parseInt(date.split("-")[0]),
							parseInt(date.split("-")[1])-1,
							parseInt(date.split("-")[2])
							*/
							parseInt('2021-07-30'.split("-")[0]),
							parseInt('2021-07-30'.split("-")[1]) - 1,
							parseInt('2021-07-30'.split("-")[2])
						)

					)

				}

				/*=============================================
				Gallery
				=============================================*/
				console.log("3 --- ")
				this.gallery.push(JSON.parse(this.product[index].gallery))

				/*=============================================
				Video
				=============================================*/

				if (JSON.parse(this.product[index].video)[0] == "youtube") {

					this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `

				}

				if (JSON.parse(this.product[index].video)[0] == "vimeo") {

					this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`

				}

				/*=============================================
				 Agregamos los tags
				 =============================================*/

				this.tags = this.product[index].tags.split(",");

				/*=============================================
				  Total Reviews
				  =============================================*/
				this.totalReviews = JSON.parse(this.product[index].reviews).length;


				this.cargando = false;

			})
		})
	}

	callback() {

		if (this.render) {

			this.render = false;

			Rating.fnc();
			CountDown.fnc();
			ProgressBar.fnc();
			Tabs.fnc();
			Quantity.fnc();
		}
	}

	callbackGallery() {

		if (this.renderGallery) {

			this.renderGallery = false;

			SlickConfig.fnc()
			ProductLightbox.fnc()

		}

	}

}
