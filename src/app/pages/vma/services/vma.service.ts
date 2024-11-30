import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, Subject, throwError , } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegistroVmaRequest } from '../models/registroVMARequest';

@Injectable({
  providedIn: 'root'
})
export class VmaService {
    url: string = `${environment.HOST}/registroVMA`;
    private messageSource = new Subject<boolean>();
    registroCompleto$ = this.messageSource.asObservable();

    constructor(private http: HttpClient) { }

    saveRegistroVMA(request: RegistroVmaRequest): Observable<number> {
        return this.http.post<number>(`${this.url}`, request);
    }

    updateRegistroVMA(idRegistroVMA: number, request: RegistroVmaRequest): Observable<number> {
      return this.http.put<number>(`${this.url}/${idRegistroVMA}`, request);
    }

    isRegistroCompleto(): Observable<boolean> {
      return this.http.get<boolean>(`${this.url}/activo`);
    }

    sendRegistroCompleto(message: boolean) {
      this.messageSource.next(message);
    }

    findById(id: number): Observable<any> {
      return this.http.get<any>(`${this.url}/findByid/${id}`);
      /*return this.http.post<any>(`${this.url}/findByid/${id}`, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
       }).pipe(catchError(this.handleError) // Manejo de errores
       );*/

    }

    actualizarEstadoIncompleto(id: number): Observable<void> {
      return this.http.put<void>(`${this.url}/estado-incompleto/${id}`, {});
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