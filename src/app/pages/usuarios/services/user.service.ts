import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, take, tap } from 'rxjs/operators';
import { User } from 'src/app/pages/usuarios/models/user';
import {CambiarPassword} from "../../../_model/cambiar-password";
import {CambiarPasswordUsuario} from "../models/cambiar-password-usuario";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = `${environment.HOST}`;
  userCambio = new Subject<any[]>();

  //token: string = sessionStorage.getItem(environment.TOKEN_NAME);
  token: string = localStorage.getItem(environment.TOKEN_NAME);

  httpOptions : any;
  private responsePage = new BehaviorSubject<any>(null);


  constructor(
    private http: HttpClient
  ) { }

  public get pageUsers$() {
    return this.responsePage.asObservable();
  }

  listuser(): Observable<any>{
    //'Authorization': 'Bearer '+this.token
    this.httpOptions = {
        headers : new HttpHeaders({
            'Content-type' : 'application/json'
        }),
        responseType : 'json'
    };
    return this.http.get(`${this.url}/usuario/listar`, this.httpOptions)
}


  page(page: number, size: number, txtSearchUser?: string){

      //'Authorization': 'Bearer '+this.token
      this.httpOptions = {
          headers : new HttpHeaders({
              'Content-type' : 'application/json'
          }),
          //params : {'txtUser': txtSearchUser},
          responseType : 'json'
      };
     // return this.http.get<User[]>(this.url+'/usuario/page'+'/'+page+'/'+size, this.httpOptions);
     return this.http.get<User[]>(this.url+'/usuario/page'+'/'+page+'/'+size, this.httpOptions).pipe(take(1),
      tap({next: (responsePage: any) => {
          this.responsePage.next(responsePage);
        }
      })
    );
  }

  findAll(){
    return this.http.get<User[]>(this.url+'/usuario/listar', {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }

  findAllLDAP() : Observable<User[]>{


    return this.http.get<User[]>(this.url+'/usuario/listarUsuariosLDAP', {
      headers : new HttpHeaders({'Content-Type':'application/json'}),
      responseType : 'json'
    });
  }



  create(user: User) : Observable<any>  {
     return this.http.post<any>(this.url +'/usuario', user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     }).pipe(catchError(this.handleError) // Manejo de errores
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

  update(user: User) : Observable<any>  {

   /* return this.http.put<User>(this.url+'/usuario', user, {
       headers: new HttpHeaders().set('Content-Type', 'application/json')
    });*/
    return this.http.put<any>(this.url +'/usuario', user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     }).pipe(catchError(this.handleError) // Manejo de errores
     );
  }



  findbyusername(nombre: string) {
    return this.http.get<any>(`${this.url}/sunass/user/findbyusername?userName=` + nombre);
  }

  findById(id: number){
    this.httpOptions = {
        headers : new HttpHeaders({
            'Content-type' : 'application/json'
        }),
        responseType : 'json'
    };
    return this.http.get<User>(this.url+'/usuario/findbyid/'+id, this.httpOptions);

  }

  findModules() {

    this.httpOptions = {
      headers : new HttpHeaders({
        'Content-type' : 'application/json'
      }),
      responseType : 'json'
    };

    return this.http.get<any>(`${this.url}/modulo/findmodules`, this.httpOptions);
  }

  findOficinas() {

    this.httpOptions = {
      headers : new HttpHeaders({
        'Content-type' : 'application/json'
      }),
      responseType : 'json'
    };
    return this.http.get<any>(`${this.url}/oficina/findall`, this.httpOptions);
  }

  searchUsers(page: number, size: number, search: string): Observable<any> {
    return this.http.get(`${this.url}/usuario?page=${page}&size=${size}&search=${search}`);
  }

  cambiarPassword(request: CambiarPassword): Observable<void> {
    return this.http.post<void>(`${this.url}/usuario/cambiar-password`, request);
  }

  cambiarPasswordUsuario(request: CambiarPasswordUsuario): Observable<void> {
    return this.http.post<void>(`${this.url}/usuario/cambiar-password-usuario`, request);
  }

  actualizarTokenPassword(userId: number): Observable<void> {
    return this.http.put<void>(`${this.url}/usuario/${userId}/actualizar-token-password`, {});
  }

  generarClaveAleatorio(): Observable<string> {
    return this.http.get(`${this.url}/usuario/generar-clave-aleatoria`, { responseType: 'text' })
  }
}