import { Seccion } from "./seccion";

export class Cuestionario {
    idCuestionario: number;
    nombre: string;
    estado: boolean;
    secciones: Seccion[]
}