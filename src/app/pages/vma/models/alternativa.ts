import { RespuestaDTO } from "./respuestaRequest";

export class Alternativa {
    
    idAlternativa: number;
    nombreCampo: string;
    respuesta: string;
    respuestaDTO: RespuestaDTO;
    requerido: boolean;
}