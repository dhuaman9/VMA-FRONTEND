
import { Empresa } from './empresa';
import { FichaRegistro } from './fichaRegistro';

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