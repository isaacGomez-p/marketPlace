import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { OwlCarouselConfig, BackgroundImage } from '../../../functions';

import { ProductsService } from '../../../services/products.service';

@Component({
	selector: 'app-home-banner',
	templateUrl: './home-banner.component.html',
	styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {

	path: String = Path.url;
	banner_home: Array<any> = [];
	category: Array<any> = [];
	url: Array<any> = [];
	render: Boolean = true;
	preload: Boolean = false;
	categories: any = [];

	constructor(private productsService: ProductsService, private cartegoriaService: CategoriesService) { }

	ngOnInit(): void {

		this.cartegoriaService.getData().subscribe(data => {
			this.categories = data;
		});

		this.preload = true;

		let index = 0;

		this.productsService.getData()
			.subscribe(resp => {

				/*=============================================
				Tomar la longitud del objeto
				=============================================*/

				let i;
				let size = 0;

				for (i in resp) {

					size++

				}

				/*=============================================
				Generar un número aleatorio 
				=============================================*/

				if (size > 5) {

					index = Math.floor(Math.random() * (size - 5));

				}
				/*=============================================
				Seleccionar data de productos con límites
				=============================================*/
				for (i in resp) {									
					console.log("JSON.parse(resp[i].horizontal_slider): " + JSON.parse(resp[i].horizontal_slider))	
					this.banner_home.push(JSON.parse(resp[i].horizontal_slider))
					this.categories.map((item) => {
						if (item.id === resp[i].category) {
							this.category.push(item.url)
						}
					})
					//this.category.push(resp[i].category)
					this.url.push(resp[i].url)					
					this.preload = false;
				}
				/*this.productsService.getLimitData(Object.keys(resp)[index], 5)
				.subscribe( resp => { 
	
					let i;
	
					for(i in resp){
					
						this.banner_home.push(JSON.parse(resp[i].horizontal_slider))
						this.category.push(resp[i].category)
						this.url.push(resp[i].url)
	
						this.preload = false;
	
					}
	
				})*/

			})

	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback() {

		if (this.render) {

			this.render = false;

			OwlCarouselConfig.fnc();
			BackgroundImage.fnc();

		}

	}

}
