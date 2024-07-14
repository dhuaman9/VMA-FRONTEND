import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  url: string = `${environment.HOST}/api/files`;
  constructor(private http: HttpClient) { }

  uploadFiles(files: any[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append(file.type, file.file);
    })
    console.log(files,"xd")
    console.log(formData)
    return this.http.post<any>(`${this.url}/upload`, formData);
  }
}
