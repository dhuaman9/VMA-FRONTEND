import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cuestionario } from '../pages/vma/models/cuestionario';



@Injectable({
  providedIn: 'root'
})

export class CuestionarioService {

    url: string = `${environment.HOST}/cuestionarios`;
    userCambio = new Subject<any[]>();
  
    token: string = localStorage.getItem(environment.TOKEN_NAME);//dhr a localStorage
    httpOptions : any;
  
    constructor(
      private http: HttpClient
    ) { }

    findById(idCuestionario: number): Observable<Cuestionario> {
      return this.http.get<Cuestionario>(`${this.url}/${idCuestionario}`);
    }

    findCuestionarioByIdMax(): Observable<Cuestionario> {
      return this.http.get<Cuestionario>(`${this.url}/lastId`);
    }

    cuestionarioConRespuestas(registroId: number): Observable<Cuestionario> {
      return this.http.get<Cuestionario>(`${this.url}/respuestas/${registroId}`);
    }
  
  }
  