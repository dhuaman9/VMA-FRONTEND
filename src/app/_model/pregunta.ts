import { Alternativa } from "./alternativa";
import { TipoPregunta } from "./tipo-pregunta";

export class Pregunta {
    
    idPregunta: number;
    respuesta: string;
    descripcion: string;
    orden: number;
    requerido: boolean;
    tipoPregunta: TipoPregunta;
    alternativas: Alternativa[];
}