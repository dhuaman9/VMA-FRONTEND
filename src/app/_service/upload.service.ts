import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    this.http.get(`${this.url}/${nodeId}/download`).pipe(
      map((response: any) => {
        const binaryString = atob(response.content);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return { filename: response.filename, blob: new Blob([bytes]) };
      })
    ).subscribe(({ filename, blob }) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error('Download error:', error);
    });

  }


  
}
