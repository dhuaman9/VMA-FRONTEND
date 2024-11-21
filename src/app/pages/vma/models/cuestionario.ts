import { Seccion } from "./seccion";
import {DatosUsuariosRegistrador} from "../../../_model/datos-usuarios-registrador.interface";

export class Cuestionario {
    idCuestionario: number;
    nombre: string;
    estado: boolean;
    secciones: Seccion[]
    datosUsuarioRegistradorDto: DatosUsuariosRegistrador;
}
