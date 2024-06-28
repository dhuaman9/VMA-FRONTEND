import { Injectable } from "@angular/core";
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { FichaRegistro } from "../_model/fichaRegistro";
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
export class FichaRegistroService{

    url: string = `${environment.HOST}`;
    //empresaCambio = new Subject<any[]>();
  
    token: string = sessionStorage.getItem(environment.TOKEN_NAME);
    httpOptions : any;

    constructor( private http: HttpClient
    ) { }

    page(page: number, size: number){

        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };
        return this.http.get<FichaRegistro[]>(this.url+'/fichas/page'+'/'+page+'/'+size, this.httpOptions);
    }

    findById(id: number){
   
        this.httpOptions = {
            headers : new HttpHeaders({
                'Content-type' : 'application/json'
            }),
            responseType : 'json'
        };
        return this.http.get<FichaRegistro>(this.url+'/fichas/findbyid/'+id, {
        headers : new HttpHeaders({'Content-Type':'application/json'}),
        responseType : 'json'
        });
     }

    findAll(){
        return this.http.get<FichaRegistro[]>(this.url+'/fichas/list', {
        headers : new HttpHeaders({'Content-Type':'application/json'}),
        responseType : 'json'
        });
    }

    create(ficha: FichaRegistro) {
        return this.http.post<FichaRegistro>(this.url+'/fichas', ficha, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    update(ficha: FichaRegistro){

        return this.http.put<FichaRegistro>(this.url+'/fichas', ficha, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }



}