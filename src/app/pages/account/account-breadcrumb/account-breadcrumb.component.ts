import { Component, OnInit } from '@angular/core';

import { UsersService } from '../../../services/users.service';


@Component({
  selector: 'app-account-breadcrumb',
  templateUrl: './account-breadcrumb.component.html',
  styleUrls: ['./account-breadcrumb.component.css']
})
export class AccountBreadcrumbComponent implements OnInit {

	displayName:string;
	usuarios: any = []
	constructor(private usersService: UsersService) { }

	ngOnInit(): void {
		if(localStorage.getItem("idToken") !== undefined){	
			this.usersService.loginAux().subscribe(data=>{
				this.usuarios = data;
				this.usuarios.map((item)=>{
					if(item.email === localStorage.getItem("email") ){
						this.displayName = item.first_name + " " + item.last_name;
					}
				});
				
			});
		}
		
		

		/*=============================================
		Validar si existe usuario autenticado
		=============================================*/
		/*this.usersService.authActivate().then(resp =>{

			if(resp){

				this.usersService.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp=>{

					for(const i in resp){

						this.displayName = resp[i].displayName;

					}

				})

			}

		})*/
	}

	/*=============================================
	Salir del sistema
	=============================================*/

	logout(){

		localStorage.removeItem('idToken');
		localStorage.removeItem('email');
		localStorage.removeItem('rememberMe');
    	localStorage.removeItem('expiresIn');
    	window.open('login', '_top')

	}

}
