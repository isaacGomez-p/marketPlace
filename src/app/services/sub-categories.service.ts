import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SubCategoriesService {

  	private api:String = Api.url;

	private url: String = 'http://190.60.254.186/Publicada/api'

  	constructor(private http:HttpClient) { }

  	getFilterData(orderBy:String, equalTo:String){
		return this.http.get(`${this.url}/MKP_Productos?idSubC=1`);
		//return this.http.get(`${this.api}sub-categories.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);

	}

	patchData(id:String, value:Object){

		return this.http.patch(`${this.api}sub-categories/${id}.json`,value);

	}
}
