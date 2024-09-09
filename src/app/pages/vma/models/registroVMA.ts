
import { Empresa } from '../../empresa/models/empresa';
import { FichaRegistro } from '../../ficha-registro/models/fichaRegistro';

export class RegistroVMA{

    idRegistroVma: number;
    tipo : string;
    estado : boolean;
    empresa: Empresa;
    fichaRegistro: FichaRegistro;
	created_at: string;
	updated_at: string;
    seleccionado?: boolean;



}