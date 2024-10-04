import { Alternativa } from "../pages/vma/models/alternativa";
import { RespuestaDTO } from "./respuestaRequest";
import { TipoPregunta } from "./tipo-pregunta";

export class Pregunta {
    idPregunta: number;
    respuesta: string;
    descripcion: string;
    orden: number;
    requerido: boolean;
    tipoPregunta: TipoPregunta;
    alternativas: Alternativa[];
    respuestaDTO: RespuestaDTO;
    preguntaDependiente: Pregunta;
    metadatoArchivo: any;
}
