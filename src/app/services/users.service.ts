import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
	Api,
	Register,
	Login,
	SendEmailVerification,
	ConfirmEmailVerification,
	GetUserData,
	SendPasswordResetEmail,
	VerifyPasswordResetCode,
	ConfirmPasswordReset,
	ChangePassword
} from '../config';

import { UsersModel } from '../models/users.model';

import { Sweetalert } from '../functions';
import { ProductsService } from './products.service';
import { CarritoComprasModel } from '../models/carritoCompras.model';

declare var jQuery: any;
declare var $: any;

@Injectable({
	providedIn: 'root'
})
export class UsersService {

	private api: string = Api.url;
	private url: String = 'http://190.60.254.186/Publicada/api';
	private register: string = Register.url;
	private login: string = Login.url;
	private sendEmailVerification: string = SendEmailVerification.url;
	private confirmEmailVerification: string = ConfirmEmailVerification.url;
	private getUserData: string = GetUserData.url;
	private sendPasswordResetEmail: string = SendPasswordResetEmail.url;
	private verifyPasswordResetCode: string = VerifyPasswordResetCode.url;
	private confirmPasswordReset: string = ConfirmPasswordReset.url;
	private changePassword: string = ChangePassword.url;

	private products: any = [];
	private usuarios: any = [];
	validacion: boolean = false;
	constructor(private http: HttpClient,
		private productosService: ProductsService) { }

	// Login
	loginAux() {
		return this.http.get(`${this.url}/MKP_Productos?idU=1`);
	}

	/*=============================================
	Registro en Firebase Authentication
	=============================================*/

	registerAuth(user: UsersModel) {

		return this.http.post(`${this.register}`, user);

	}

	/*=============================================
	Registro en Firebase Database
	=============================================*/

	registerDatabase(user: UsersModel) {

		return this.http.post(`${this.url}/MKP_Productos`, user);

	}

	/*=============================================
	Filtrar data para buscar coincidencias
	=============================================*/

	getFilterData(orderBy: string, equalTo: string) {

		//return this.http.get(`${this.api}users.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	/*=============================================
	Login en Firebase Authentication
	=============================================*/

	loginAuth(user: UsersModel) {

		return this.http.post(`${this.login}`, user);

	}

	/*=============================================
	Enviar verificación de correo electrónico
	=============================================*/

	sendEmailVerificationFnc(body: object) {

		return this.http.post(`${this.sendEmailVerification}`, body);

	}

	/*=============================================
	Confirmar email de verificación
	=============================================*/

	confirmEmailVerificationFnc(body: object) {

		return this.http.post(`${this.confirmEmailVerification}`, body);

	}

	/*=============================================
	Actualizar data de usuario
	=============================================*/

	patchData(id: string, value: object) {

		return this.http.patch(`${this.api}users/${id}.json`, value);

	}

	/*=============================================
		Validar idToken de Autenticación
		=============================================*/

	authActivate() {

		return new Promise(resolve => {

			/*=============================================
				Validamos que el idToken sea real
				=============================================*/

			if (localStorage.getItem("idToken")) {

				let body = {

					idToken: localStorage.getItem("idToken")
				}

				this.http.post(`${this.getUserData}`, body)
					.subscribe(resp => {

						/*=============================================
							Validamos fecha de expiración
							=============================================*/

						if (localStorage.getItem("expiresIn")) {

							let expiresIn = Number(localStorage.getItem("expiresIn"));

							let expiresDate = new Date();
							expiresDate.setTime(expiresIn);

							if (expiresDate > new Date()) {

								resolve(true)

							} else {

								localStorage.removeItem('idToken');
								localStorage.removeItem('expiresIn');
								resolve(false)
							}

						} else {

							localStorage.removeItem('idToken');
							localStorage.removeItem('expiresIn');
							resolve(false)

						}


					}, err => {

						localStorage.removeItem('idToken');
						localStorage.removeItem('expiresIn');
						resolve(false)

					})

			} else {

				localStorage.removeItem('idToken');
				localStorage.removeItem('expiresIn');
				resolve(false)
			}

		})

	}

	/*=============================================
Resetear la contraseña
=============================================*/

	sendPasswordResetEmailFnc(body: object) {

		return this.http.post(`${this.sendPasswordResetEmail}`, body)

	}

	/*=============================================
Confirmar el cambio de la contraseña
=============================================*/

	verifyPasswordResetCodeFnc(body: object) {

		return this.http.post(`${this.verifyPasswordResetCode}`, body)

	}

	/*=============================================
Enviar la contraseña
=============================================*/

	confirmPasswordResetFnc(body: object) {

		return this.http.post(`${this.confirmPasswordReset}`, body)

	}

	/*=============================================
Cambiar la contraseña
=============================================*/

	changePasswordFnc(body: UsersModel) {

		return this.http.put(`${this.url}/MKP_Productos?id=` + body.id, body)

	}

	/*=============================================
Tomar información de un solo usuario
=============================================*/

	getUniqueData(value: string) {

		return this.http.get(`${this.api}users/${value}.json`);
	}

	/*=============================================
	Función para agregar productos a la lista de deseos
	=============================================*/

	/*addWishlist(product: string) {

		/*=============================================
		Validamos que el usuario esté autenticado
		=============================================*/

	/*	this.authActivate().then(resp => {

			if (!resp) {

				Sweetalert.fnc("error", "The user must be logged in", null)

				return;

			} else {

				/*=============================================
				Traemos la lista de deseos que ya tenga el usuario
				=============================================*/
	/*		this.getFilterData("idToken", localStorage.getItem("idToken"))
				.subscribe(resp => {

					/*=============================================
					Capturamos el id del usuario
					=============================================*/
	/*
							let id = Object.keys(resp).toString();
	
							for (const i in resp) {
	
								/*=============================================
									Pregutnamos si existe una lista de deseos
									=============================================*/

	/*							if (resp[i].wishlist != undefined) {
	
									let wishlist = JSON.parse(resp[i].wishlist);
	
									let length = 0;
	
									/*=============================================
									Pregutnamos si existe un producto en la lista de deseos
									=============================================*/

	/*							if (wishlist.length > 0) {

									wishlist.forEach((list, index) => {

										if (list == product) {

											length--

										} else {

											length++

										}

									})

									/*=============================================
								Preguntamos si no ha agregado este producto a la lista de deseos anteriormente
								=============================================*/

	/*									if (length != wishlist.length) {
	
											Sweetalert.fnc("error", "It already exists on your wishlist", null);
	
										} else {
	
											wishlist.push(product);
	
											let body = {
	
												wishlist: JSON.stringify(wishlist)
											}
	
											this.patchData(id, body)
												.subscribe(resp => {
	
													if (resp["wishlist"] != "") {
	
														let totalWishlist = Number($(".totalWishlist").html());
	
														$(".totalWishlist").html(totalWishlist + 1);
	
														Sweetalert.fnc("success", "Product added to wishlist", null);
													}
	
												})
	
										}
	
									} else {
	
										wishlist.push(product);
	
										let body = {
	
											wishlist: JSON.stringify(wishlist)
										}
	
										this.patchData(id, body)
											.subscribe(resp => {
	
												if (resp["wishlist"] != "") {
	
													let totalWishlist = Number($(".totalWishlist").html());
	
													$(".totalWishlist").html(totalWishlist + 1);
	
													Sweetalert.fnc("success", "Product added to wishlist", null);
												}
	
	
											})
	
									}
	
									/*=============================================
									Cuando no exista lista de deseos inicialmente
									=============================================*/
	/*
								} else {
	
									let body = {
	
										wishlist: `["${product}"]`
									}
	
									this.patchData(id, body)
										.subscribe(resp => {
	
											if (resp["wishlist"] != "") {
	
												let totalWishlist = Number($(".totalWishlist").html());
	
												$(".totalWishlist").html(totalWishlist + 1);
	
												Sweetalert.fnc("success", "Product added to wishlist", null);
											}
	
										})
	
								}
	
							}
	
						})
	
				}
	
			})
	
		}
	*/

	/*=============================================
	Función para agregar productos a la lista de deseos
	=============================================*/

	addWishList(product) {
		if (localStorage.getItem("idToken") !== undefined) {
			if (localStorage.getItem("email") !== undefined) {
				this.loginAux().subscribe(data => {
					this.usuarios = data;
					this.usuarios.map(item => {
						if (item.email === localStorage.getItem("email")) {
							let deseos = []
							if (item.city !== 'city') {
								deseos = JSON.parse(item.city)
							}

							let validacion = true;
							deseos.map(itemDeseos => {
								if (itemDeseos.id + "" === product.id + "") {
									validacion = false;
								}
							})
							if (validacion === true) {
								deseos.push(
									{
										"id": product.id + ''
									}
								)
								item.city = JSON.stringify(deseos);
								this.modificarUsuario(item)

							} else {
								Sweetalert.fnc("error", "Ya se encuentra registrado.", null)
							}

						}
					})
				})
			}
		} else {
			Sweetalert.fnc("error", "Por favor inicie sesión", null)
		}
	}

	modificarUsuario(usuario) {
		this.changePasswordFnc(usuario).subscribe(data => {
			let totalWishlist = Number($(".totalWishlist").html());
			$(".totalWishlist").html(totalWishlist + 1);
			Sweetalert.fnc("success", "Agregado correctamente.", null)
		});
	}

	/*=============================================
	Función para agregar productos al carrito de compras
	=============================================*/

	addShoppinCart(itemObject: CarritoComprasModel) {

		this.productosService.getData().subscribe((data) => {
			this.products = data;
			this.products.map((item) => {
				if (item.id === itemObject.product) {
					/*=============================================
					Valida la cantidad disponible del producto
					=============================================*/
					if (item.stock === 0) {
						Sweetalert.fnc("error", "No hay cantidad disponible", null);
					} else {
						/*=============================================
						Agregar el producto al localStorage
						=============================================*/
						let listaCarrito = [];
						if (localStorage.getItem("list") === null) {
							listaCarrito.push(itemObject);
							localStorage.setItem("list", JSON.stringify(listaCarrito))
							Sweetalert.fnc("success", "Producto adicionado a tu carrito de compras.", itemObject.url);
						} else {
							listaCarrito = JSON.parse(localStorage.getItem("list"))
							/*=============================================
							Validación en el caso que ya este agregado el producto al carrito
							=============================================*/
							let cant = 0;
							listaCarrito.map((itemCarrito) => {
								if (itemCarrito.product === itemObject.product) {
									cant = itemCarrito.unit;
									cant = cant + itemObject.unit;
									itemCarrito.unit = cant;
									this.validacion = true;
								}
							})
							if (this.validacion === false) {
								listaCarrito.push(itemObject)
								localStorage.setItem("list", JSON.stringify(listaCarrito))
								Sweetalert.fnc("success", "Producto adicionado a tu carrito de compras.", itemObject.url);
							} else {
								localStorage.setItem("list", JSON.stringify(listaCarrito))
								Sweetalert.fnc("success", "Producto adicionado a tu carrito de compras.", itemObject.url);
							}

						}
					}
				}
			})

		})
	}

	/*=============================================
	Función para agregar productos al carrito de compras
	=============================================*/

	getCountries(){
		return this.http.get('./assets/json/paises.json');
	}

}
