import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { take, tap } from 'rxjs/operators';
import { Seccion } from '../pages/vma/models/seccion';



@Injectable({
  providedIn: 'root'
})

export class SeccionesService {

    url: string = `${environment.HOST}`;
    userCambio = new Subject<any[]>();
  
    token: string = sessionStorage.getItem(environment.TOKEN_NAME);
    httpOptions : any;
    private responsePage = new BehaviorSubject<any>(null);
  
  
    constructor(
      private http: HttpClient
    ) { }
  
   /* public get pageUsers$() {
      return this.responsePage.asObservable();
    }*/
    
  
    findAll() : Observable<Seccion[]>{
      return this.http.get<Seccion[]>(this.url+'/secciones/listar', {
        headers : new HttpHeaders({'Content-Type':'application/json'}),
        responseType : 'json'
      });
    }
  
  
   /* findById(id: number){
     
  
      this.httpOptions = {
          headers : new HttpHeaders({
              'Content-type' : 'application/json'
          }),
          responseType : 'json'
      };
      return this.http.get<User>(this.url+'/usuario/findbyid/'+id, this.httpOptions);
      
    }*/
  
  
  }
  