import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

	private api:String = Api.url;
	private apiUrl:String = Api.urlApi;

	private url: String = 'http://190.60.254.186/Publicada/api'

  	constructor(private http:HttpClient) { }

  	getData(){
		return this.http.get(`${this.url}/MKP_Productos?idCate=1`);
	}

	getFilterData(orderBy:String, equalTo:String){

		return this.http.get(`${this.api}categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	patchData(id:String, value:Object){

		return this.http.patch(`${this.api}categories/${id}.json`,value);

	}
	
}
