import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroVmaRequest } from '../_model/registroVMARequest';

@Injectable({
  providedIn: 'root'
})
export class VmaService {
    url: string = `${environment.HOST}/registroVMA`;

    constructor(private http: HttpClient) { }

    saveRegistroVMA(request: RegistroVmaRequest): Observable<void> {
        return this.http.post<void>(`${this.url}`, request);
    }
}