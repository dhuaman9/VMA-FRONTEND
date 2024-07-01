import { RespuestaDTO } from "./respuestaRequest";

export class RegistroVmaRequest {
    idEmpresa: number;
    registroValido: boolean;
    respuestas: RespuestaDTO[];
}