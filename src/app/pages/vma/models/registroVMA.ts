
import { Empresa } from '../../empresa/models/empresa';
import { FichaRegistro } from '../../ficha-registro/models/fichaRegistro';

export class RegistroVMA{

    idRegistroVma: number;
    estado : boolean;
    empresa: Empresa;
    fichaRegistro: FichaRegistro;
	createdAt: String;  //String
	updatedAt: String;  //String
    seleccionado?: boolean;

}