import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  	private api:String = Api.url;

	private url: String = 'http://190.60.254.186/Publicada/api'

  	constructor(private http:HttpClient) { }

  	getData(){

		return this.http.get(`${this.url}/MKP_Products?idS=1`);

	}

	getFilterData(orderBy:String, equalTo:String){

		return this.http.get(`${this.api}stores.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

}
