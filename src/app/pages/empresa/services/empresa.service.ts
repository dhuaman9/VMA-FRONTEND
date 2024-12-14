import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {  HttpClient,  HttpHeaders, HttpErrorResponse,  HttpParams, } from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { catchError, take, tap } from 'rxjs/operators';
import { PageableResponse } from 'src/app/_model/pageableResponse';
import { TipoEmpresa } from '../models/tipoEmpresa';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  url: string = `${environment.HOST}`;
  empresaCambio = new Subject<any[]>();

  token: string = localStorage.getItem(environment.TOKEN_NAME);

  httpOptions: any;

  constructor(private http: HttpClient) {}

  page(page: number, size: number) {
    //'Authorization': 'Bearer '+this.token
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
      responseType: 'json',
    };
    return this.http.get<Empresa[]>(
      this.url + '/empresa/page' + '/' + page + '/' + size,
      this.httpOptions
    );
  }

  findById(id: number) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
      }),
      responseType: 'json',
    };
    return this.http.get<Empresa>(this.url + '/empresa/findbyid/' + id, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    });
  }

  findAll() {
    return this.http.get<Empresa[]>(this.url + '/empresa/list', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    });
  }
  findAllTipoEmpresas() {
    return this.http.get<TipoEmpresa[]>(this.url + '/empresa/tipoEmpresas', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'json',
    });
  }

  findAllPageable(page: number = 0, size: number = 10, filter: string = '') {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filter) {
      params = params.set('filter', filter);
    }
    return this.http.get<PageableResponse<Empresa[]>>(
      this.url + '/empresa/listarPaginado',
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'json',
        params: params,
      }
    );
  }

  create(empresa: Empresa) {
    return this.http
      .post<Empresa>(this.url + '/empresa', empresa, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(
        catchError(this.handleError) // Manejo de errores
      );
  }

  update(empresa: Empresa) {
    return this.http
      .put<Empresa>(this.url + '/empresa', empresa, {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
      })
      .pipe(
        catchError(this.handleError) // Manejo de errores
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
