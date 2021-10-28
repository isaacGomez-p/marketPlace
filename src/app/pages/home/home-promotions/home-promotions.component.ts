import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-promotions',
  templateUrl: './home-promotions.component.html',
  styleUrls: ['./home-promotions.component.css']
})
export class HomePromotionsComponent implements OnInit {

	path:String = Path.url;
	banner_default:Array<any> = [];	
	category:Array<any> = [];
	url:Array<any> = [];
	preload:Boolean = false;
	categories: any = [];

  	constructor(private productsService: ProductsService, private cartegoriaService: CategoriesService) { }

  	ngOnInit(): void {

		this.cartegoriaService.getData().subscribe(data => {
			this.categories = data;
		});

		console.log("path"+this.path);
		this.preload = true;

		let index = 0;

		this.productsService.getData()
		.subscribe(resp =>{
			
			/*=============================================
			Tomar la longitud del objeto
			=============================================*/

			let i;
			let size = 0;

			for(i in resp){

				size++			

			}

			/*=============================================
			Generar un número aleatorio 
			=============================================*/

			if(size > 2){

				index = Math.floor(Math.random()*(size-2));

			}

			for(i in resp){
				if(i<2){
					this.banner_default.push(resp[i].default_banner)
				}
				
				this.categories.map((item) => {
					if (item.id === resp[i].category) {							
						this.category.push(item.url)
					}
				})				
				this.url.push(resp[i].url)

				this.preload = false;

			}


			/*=============================================
			Seleccionar data de productos con límites
			=============================================*/


/*			this.productsService.getLimitData(Object.keys(resp)[index], 2)
			.subscribe( resp => { 

				let i;

				for(i in resp){
				
					this.banner_default.push(resp[i].default_banner)
					this.category.push(resp[i].category)
					this.url.push(resp[i].url)

					this.preload = false;

				}

			})*/

		})

	}

}
