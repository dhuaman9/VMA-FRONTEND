


import { Role } from "src/app/_model/role";
import { Empresa } from "../../empresa/models/empresa";
import { Profile } from "src/app/_model/profile";

export class User {

    id: number;
    estado : boolean;
    tipo : string;
    nombres : string;
    apellidos: string;
    username : string;
    role: Role;
    password: string;
   // eps: string;
    empresa: Empresa;
    unidadOrganica: string;
    correo: string;
    telefono: string;
    modules : Profile[];
    inLdap : boolean;
    mail : string;
    positionName : string;
    areaName : string;

    constructor(data: Partial<User>) {
        //Object.assign(this, data);
        for (const key in data) {
        if (data.hasOwnProperty(key)) {
            (this as any)[key] = data[key];
        }
        }
    }




}