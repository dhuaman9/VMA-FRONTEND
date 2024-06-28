import { Pregunta } from "./pregunta";

export class Seccion {
    idSeccion: number;
    nombre : string;
    orden: number;
    estado : boolean;
    preguntas: Pregunta[];
}