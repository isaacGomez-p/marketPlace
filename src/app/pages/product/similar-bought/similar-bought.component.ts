import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { Rating, 
	     DinamicRating, 
         DinamicReviews, 
         DinamicPrice   } from '../../../functions';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from 'src/app/services/users.service';
import { CarritoComprasModel } from 'src/app/models/carritoCompras.model';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-similar-bought',
  templateUrl: './similar-bought.component.html',
  styleUrls: ['./similar-bought.component.css']
})
export class SimilarBoughtComponent implements OnInit {

  path:String = Path.url;	
  	products:Array<any> = [];
  	rating:Array<any> = [];
  	reviews:Array<any> = [];
  	price:Array<any> = [];
  	render:Boolean = true;
  	cargando:Boolean = false;
	url: String = "";
	categorias: any = [];

  	constructor(private activateRoute: ActivatedRoute,
  		        private productsService: ProductsService,
				private usuarioService: UsersService,
				private categoriaService: CategoriesService,
				private router: Router) { }

  	ngOnInit(): void {

  		this.cargando = true;
		this.url = this.activateRoute.snapshot.params["param"];
		this.productsService.getData().subscribe(data => {
			this.productsFnc(data);
		});
		

 		/*this.productsService.getFilterData("url", this.activateRoute.snapshot.params["param"]) 
  		.subscribe( resp => { 

  			for(const i in resp){
  				
  				this.productsService.getFilterData("sub_category", resp[i].sub_category)
  				.subscribe( resp => {
  					
  					this.productsFnc(resp);		

  				})

  			}

  		})*/ 
  	}

  	/*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/	

  	productsFnc(response){

		this.categoriaService.getData().subscribe(data => {
			this.categorias = data;

			this.products = [];

			/*=============================================
			Hacemos un recorrido por la respuesta que nos traiga el filtrado
			=============================================*/	

			let i;
			let getProduct = [];
			let product;
			
			for(i in response){		  
				if(this.url == response[i]["url"]){				
					product = response[i];				
				}			 									
			}

			for(i in response){		  
				if(this.url != response[i]["url"]){				
					if(product["sub_category"] === response[i]["sub_category"]){
						this.categorias.map((item)=>{
							if(item.id === response[i].category){
								response[i].category = item.url
								getProduct.push(response[i]);
							}
						})  	  									
					}				
				}           	        
			}

			/*=============================================
			Ordenamos de mayor a menor views el arreglo de objetos
			=============================================*/	

			getProduct.sort(function(a,b){
				return (b.views - a.views)
			})	

			/*=============================================
			Filtramos el producto
			=============================================*/

			getProduct.forEach((product, index)=>{

				if(index < 6){

					this.products.push(product);

					/*=============================================
					Rating y Review
					=============================================*/
				
					this.rating.push(DinamicRating.fnc(this.products[index]));
				
					this.reviews.push(DinamicReviews.fnc(this.rating[index]));
			
					/*=============================================
					Price
					=============================================*/        

					this.price.push(DinamicPrice.fnc(this.products[index]));
					
					this.cargando = false;
				}


			})
		})
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

	callback(){

  		if(this.render){


  			this.render = false;

  			setTimeout(function(){

  				Rating.fnc();

  			},1000)

  		}
	}

	addWishList(product){
		this.usuarioService.addWishList(product);
	}
}
