import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  url: string = `${environment.HOST}/archivo`;
  constructor(private http: HttpClient) { }

  uploadFile(file: any, registroVMAId: number, preguntaId: number, respuestaId: number): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("registroVMAId", registroVMAId.toString());
    formData.append("preguntaId", preguntaId.toString());
    if(respuestaId) {
      formData.append("respuestaId", respuestaId.toString());
    }
    return this.http.post<any>(`${this.url}/upload`, formData);
  }

  downloadFile(nodeId: string): void {
    this.http.get(`${this.url}/${nodeId}/download`, {
      responseType: 'blob'
    }).subscribe((response: Blob) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const a = document.createElement('a');
        a.href = e.target.result;
        a.download = 'filename.ext';//se cambiaría por algun nombre en específico
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
      reader.readAsDataURL(response);
    }, error => {
      console.error('Ocurrió algo', error);
    });

  }
}
