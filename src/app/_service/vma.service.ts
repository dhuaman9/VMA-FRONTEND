import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { RegistroVmaRequest } from '../_model/registroVMARequest';

@Injectable({
  providedIn: 'root'
})
export class VmaService {
    url: string = `${environment.HOST}/registroVMA`;
    private messageSource = new Subject<boolean>();
    registroCompleto$ = this.messageSource.asObservable();

    constructor(private http: HttpClient) { }

    saveRegistroVMA(request: RegistroVmaRequest): Observable<void> {
        return this.http.post<void>(`${this.url}`, request);
    }

    updateRegistroVMA(idRegistroVMA: number, request: RegistroVmaRequest): Observable<void> {
      return this.http.put<void>(`${this.url}/${idRegistroVMA}`, request);
    }

    isRegistroCompleto(): Observable<boolean> {
      return this.http.get<boolean>(`${this.url}/activo`);
    }

    sendRegistroCompleto(message: boolean) {
      this.messageSource.next(message);
    }
}