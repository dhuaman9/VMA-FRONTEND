import { RespuestaDTO } from "./respuestaRequest";
import {DatosUsuariosRegistrador} from "../../../_model/datos-usuarios-registrador.interface";

export class RegistroVmaRequest {
    idEmpresa: number;
    registroValido: boolean;
    respuestas: RespuestaDTO[];
    datosUsuarioRegistradorDto: DatosUsuariosRegistrador;
}