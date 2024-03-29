import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})

export class ProductsService {

	private api:String = Api.url;
	private productos: any = [];
	private url: String = 'http://190.60.254.186/Publicada/api'

	constructor(private http:HttpClient ) { }

	getData(){
		return this.http.get(`${this.url}/MKP_Productos?idPr=1`);
	}	

	getLimitData(startAt:String, limitToFirst:Number){

		///return this.http.get(`${this.api}products.json?orderBy="$key"&startAt="${startAt}"&limitToFirst=${limitToFirst}&print=pretty`);

	}

	getFilterData(orderBy:String, equalTo:String){

		//return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	getFilterDataWithLimit(orderBy:String, equalTo:String, limitToFirst:Number){

		//return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=${limitToFirst}&print=pretty`);

	}

	getSearchData(orderBy:String, param:String){

		//return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&startAt="${param}"&endAt="${param}\uf8ff"&print=pretty`);

	}

	patchData(id:String, value:Object){

		return this.http.patch(`${this.api}products/${id}.json`,value);

	}
}
