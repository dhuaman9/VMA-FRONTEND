import {RecuperarPassword} from "../../anonimo/models/recuperar-password";

export class CambiarPasswordUsuario extends RecuperarPassword{
  constructor(public username: string,
              public nuevaPassword: string,
              public repetirPassword: string) {
    super(nuevaPassword, repetirPassword);}
}
