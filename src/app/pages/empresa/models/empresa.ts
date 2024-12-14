import { TipoEmpresa } from "./tipoEmpresa";

export class Empresa {

    idEmpresa: number;
    nombre : string;
    regimen: string;
    //tipo: string;
    tipoEmpresa: TipoEmpresa;
    //estado : boolean;  // el area DF no lo necesita, por ahora.


}
