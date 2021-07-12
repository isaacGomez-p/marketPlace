import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from '../config';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

	private api:String = Api.url;

	private url: String = 'http://190.60.254.186/Publicada/api'

  	constructor(private http:HttpClient) { }

	getData(){

		return this.http.get(`${this.url}/MKP_Productos?idSal=1`);

	}
}
