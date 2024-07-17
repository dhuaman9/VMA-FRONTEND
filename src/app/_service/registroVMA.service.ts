import { Injectable } from "@angular/core";
import { RegistroVMA } from "../_model/registroVMA";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
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


  searchRegistroVmas(empresaId?: number, estado?: string, fechaInicio?: Date, fechaFin?: Date, year?: number): Observable<any> {
    let params = new HttpParams();
    if (empresaId) params = params.set('empresaId', empresaId.toString());
    if (estado) params = params.set('estado', estado);
    if (fechaInicio) {
      params = params.set('startDate', this.formatearFecha(fechaInicio));
    }
    if (fechaFin) {
      params = params.set('endDate', this.formatearFecha(fechaFin));
    }
    if (year) params = params.set('year', year.toString());
    return this.http.get(`${this.url}/registroVMA/search`, { params });
  }

  private formatearFecha(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  
}