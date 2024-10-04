import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, Subject, throwError } from 'rxjs';
//import { FichaRegistro } from "../pages/ficha-registro/models/fichaRegistro";
import { map } from 'rxjs/operators';
import { catchError, take, tap } from 'rxjs/operators';
import { FichaRegistro } from "../models/fichaRegistro";
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class FichaRegistroService{

    url: string = `${environment.HOST}`;
    
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

    create(ficha: FichaRegistro) : Observable<any>  {
        return this.http.post<FichaRegistro>(this.url+'/fichas', ficha, {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
            }).pipe(catchError(this.handleError) // Manejo de errores
        );
     }

    update(ficha: FichaRegistro){
        return this.http.put<FichaRegistro>(this.url+'/fichas', ficha, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
        }).pipe(catchError(this.handleError) // Manejo de errores
        );
    }

    cantidadDiasFaltantesVMA(): Observable<number> {  //se utiliza para alertar al registrador, los dias faltantes de registro VMA
        return this.http.get<number>(this.url+'/fichas'+'/dias-faltantes');
      }


    obtenerPeriodoActivo(): Observable<FichaRegistro | null> {
        return this.http.get<FichaRegistro>(this.url+'/fichas/periodo-activo', { observe: 'response' }).pipe(
          map(response => {
            if (response.status === 204) {
              console.log('No hay periodo activo disponible');
              return null;
            }
            return response.body;
          }),
          catchError((error) => {
            console.error('Error en la solicitud', error);
            return of(null); // Retorna null en caso de error para evitar romper la aplicación
          })
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ocurrió un error inesperado';
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente o de la red
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // El backend retornó un código de error y el mensaje
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }
        return throwError(errorMessage);
      }

}