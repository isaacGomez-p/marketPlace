import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';

declare var jQuery:any;
declare var $:any;

import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

	path:String = Path.url;	
	categories:Object = null;
	render:Boolean = true;
	categoriesList:Array<any> = [];

	constructor(private categoriesService: CategoriesService, private subCategoriesService: SubCategoriesService) { }

	ngOnInit(): void {

		/*=============================================
		Tomamos la data de las categorías
		=============================================*/

		this.categoriesService.getData()
		.subscribe(resp => {
			
			this.categories = resp;

			let i;

			for(i in resp){

				/*=============================================
				Separamos los nombres de categorías
				=============================================*/

				this.categoriesList.push(
					{
						"name": resp[i].name,
						"id": resp[i].id
					})
			}			
		})
	}

	/*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

	callback(){

		if(this.render){

			this.render = false;

			let arraySubCategories = [];

			/*=============================================
			Separar las categorías
			=============================================*/

			this.categoriesList.map(category=>{
				
				/*=============================================
				Tomamos la colección de las sub-categorías filtrando con los nombres de categoría
				=============================================*/				
				this.subCategoriesService.getFilterData("category", category)
				.subscribe(resp=>{
					
					/*=============================================
					Hacemos un recorrido por la colección general de subcategorias y clasificamos las subcategorias y url
					de acuerdo a la categoría que correspondan
					=============================================*/

					let i;
					
					for(i in resp){
						let validacion = true;
						arraySubCategories.map((item)=>{
							if(item.id === resp[i].id){
								validacion = false;
							}
						})
						if(validacion === true){
							arraySubCategories.push({
								"category": resp[i].category,
								"subcategory": resp[i].name,
								"url": resp[i].url,
								"id": resp[i].id
							})
						}
					}
					
					/*=============================================
					Recorremos el array de objetos nuevo para buscar coincidencias con los nombres de categorías
					=============================================*/
					arraySubCategories.map((item)=>{						
						if(category.id === item.category){
							$(`[category-footer='${category.id}']`).after(

								`<a href="products/${item.url}">${item.subcategory}</a>`

		                    )
						}	
					})
					
					/*for(i in arraySubCategories){
						
						if(category.id === arraySubCategories[i].category){		
							$(`[category-footer='${category}']`).after(

								`<a href="products/${arraySubCategories[i].url}">${arraySubCategories[i].subcategory}</a>`

		                    )


						}


					}*/
				})

			})			

		}

	}

}
