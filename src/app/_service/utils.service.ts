import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  encrypt(id : number){
    let codigo =  "$%" + String.fromCharCode(id * 15) + "&&__$";
    return codigo;
  }

  desencrypt(codigo : string){
    return (codigo.substring(2,3).charCodeAt(0))/15;
  }

  formatStrToExcel(str : string){
   let rsStr = this.camelize(str.replace(/\./g, ''));
   return rsStr.charAt(0).toUpperCase() + rsStr.slice(1);
  }

  camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
}
