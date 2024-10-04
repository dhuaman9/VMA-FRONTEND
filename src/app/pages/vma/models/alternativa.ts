import { RespuestaDTO } from "../../../_model/respuestaRequest";

export class Alternativa {
    
    idAlternativa: number;
    nombreCampo: string;
    respuesta: string;
    respuestaDTO: RespuestaDTO;
    requerido: boolean; //dhr
}