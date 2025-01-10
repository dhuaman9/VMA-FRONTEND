import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, concatMap, filter, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtDTO } from '../_dto/jwtDto';
import { LoginService } from 'src/app/pages/login/services/login.service';
import { SessionService } from './session.service';
import Swal from 'sweetalert2';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private sessionService: SessionService,
    private loginService: LoginService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.sessionService.estaLogeado()) {
      return next.handle(req);
    }

    let intReq = req;
    const token = localStorage.getItem(environment.TOKEN_NAME);

    intReq = this.addToken(req, token);

    //console.log('prev refreshing....');

    return next.handle(intReq).pipe(
      catchError((error) => {
        if (token) {
          const tokenPayload = this.decodeToken(token);
          if (tokenPayload && tokenPayload.exp) {
            const currentTime = Math.floor(Date.now() / 1000);
            if (tokenPayload.exp < currentTime) {
              Swal.fire({
                icon: 'warning',
                title: 'Sesión Terminada.',
                text: 'Tu sesión terminó tras una hora de inactividad. Inicia sesión nuevamente para continuar.',
                confirmButtonText: 'Aceptar'
              });

              this.sessionService.cerrarSession();
              throw new Error('Token expirado');
              //return throwError(() => new Error('Token expirado'));
            }
          }
        }

        console.log('catchError-error - ', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(intReq, next);
        } else if (error instanceof HttpErrorResponse && error.status === 400) {
          // Manejar errores 400(bad request) , se puede mostrar alerts
          console.log('error.error.message  - ', error.error.message);
        } else if (error instanceof HttpErrorResponse && error.status === 403) {
          console.log('error.error.message  - ', error.error.message);
          Swal.fire({
            icon: 'error',
            title: 'Permiso denegado.',
            text: 'No puede ingresar a otro registro.',
            confirmButtonText: 'Aceptar',
          });
        } else {// si es otro error desconocido, lo detectara como 500

          Swal.fire({
            icon: 'error',
            title: 'Error del servidor.',
            text: 'Hemos tenido un inconveniente en el servidor. Por favor, inténtelo  nuevamente. Si el problema persiste, no dudes en contactar con nuestro equipo de soporte técnico.',
            confirmButtonText: 'Aceptar',
          });
        }

        //return throwError(error);
        return throwError(error);
      })
    );
  }

  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      //console.log('refresing ...');
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      //const token = sessionStorage.getItem(environment.TOKEN_NAME);

      const token = this.sessionService.retornarJwt();

      if (token) {
        const dto: JwtDTO = new JwtDTO(token);

        return this.loginService.refresh(dto).pipe(
          switchMap((data: any) => {
            this.isRefreshing = false;

            if (data.value) {
              localStorage.setItem(environment.TOKEN_NAME, data.value);
              this.refreshTokenSubject.next(data.value);
              return next.handle(this.addToken(request, data.value));
            } else {
              this.sessionService.cerrarSession();
              return throwError('No se renovo token');
            }
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.sessionService.cerrarSession();
            return throwError(err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
  }
}

export const interceptorProvider = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
];
