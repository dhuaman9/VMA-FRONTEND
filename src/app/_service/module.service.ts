import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  url = environment.HOST;
  private moduleCambio = new Subject<any[]>();

  constructor(
    private http : HttpClient
  ) { }

  getModuleCambio(){
    return this.moduleCambio.asObservable();
  }

  setModuleCambio(modules : any[]){
    this.moduleCambio.next(modules);
  }

  findAll(){
    return this.http.get<any>(`${this.url}/admin/module/findall?withdefault=false&defaultText=%20`);
  }
  findAllWithProfiles(){
    return this.http.get<any>(`${this.url}/admin/module/findallwithprofiles`);
  }
}
