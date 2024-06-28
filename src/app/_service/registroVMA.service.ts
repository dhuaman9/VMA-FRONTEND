import { Injectable } from "@angular/core";
import { RegistroVMA } from "../_model/registroVMA";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {  Subject } from 'rxjs';
import { RegistroVmaRequest } from "../_model/registroVMARequest";
import { Observable } from 'rxjs';

    @Injectable({
        providedIn: 'root'
    })

  export class RegistroVMAService {
  
  url: string = `${environment.HOST}`;

  token: string = sessionStorage.getItem(environment.TOKEN_NAME);
  httpOptions : any;

  constructor( private http: HttpClient
  ) { 

  }

  findById(id: number){
   
    this.httpOptions = {
        headers : new HttpHeaders({
            'Content-type' : 'application/json'
        }),
        responseType : 'json'
    };
    return this.http.get<RegistroVMA>(this.url+'/registroVMA/findByid/'+id, {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }


  findAll(){
    return this.http.get<RegistroVMA[]>(this.url+'/registroVMA/listar', {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }

  saveRegistroVMA(request: RegistroVmaRequest): Observable<void> {
    return this.http.post<void>(`${this.url}/registroVMA`, request);
  }
 /* create(empresa: Empresa) {
    return this.http.post<Empresa>(this.url+'/empresa', empresa, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(empresa: Empresa){

    return this.http.put<Empresa>(this.url+'/empresa', empresa, {
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }*/


}