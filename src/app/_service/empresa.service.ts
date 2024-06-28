import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {  Subject } from 'rxjs';
import { Empresa } from "../_model/empresa";

@Injectable({
    providedIn: 'root'
  })
  export class EmpresaService {

  url: string = `${environment.HOST}`;
  empresaCambio = new Subject<any[]>();

  token: string = sessionStorage.getItem(environment.TOKEN_NAME);
  httpOptions : any;

  constructor( private http: HttpClient
  ) { }


    page(page: number, size: number){

        //'Authorization': 'Bearer '+this.token
        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };
        return this.http.get<Empresa[]>(this.url+'/empresa/page'+'/'+page+'/'+size, this.httpOptions);
    }

    /*findAll(){

      //'Authorization': 'Bearer '+this.token
      this.httpOptions = {
          headers : new HttpHeaders({
              'Content-type' : 'application/json'
          }),
          responseType : 'json'
      };
      return this.http.get<Empresa[]>(this.url+'/empresa/list', this.httpOptions);
    }*/

  
  findById(id: number){
   
    this.httpOptions = {
        headers : new HttpHeaders({
            'Content-type' : 'application/json'
        }),
        responseType : 'json'
    };
    return this.http.get<Empresa>(this.url+'/empresa/findbyid/'+id, {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }


  findAll(){
    return this.http.get<Empresa[]>(this.url+'/empresa/list', {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }

  create(empresa: Empresa) {
    return this.http.post<Empresa>(this.url+'/empresa', empresa, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  update(empresa: Empresa){

    return this.http.put<Empresa>(this.url+'/empresa', empresa, {
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }




  }