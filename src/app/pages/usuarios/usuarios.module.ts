import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import {UsuariosComponent} from "./components/usuarios-list/usuarios.component";
import {RegistrarUsuarioComponent} from "./components/registrar-usuario/registrar-usuario.component";
import {EditarUsuarioComponent} from "./components/editar-usuario/editar-usuario.component";
import {SharedModule} from "../../shared/shared.module";
import {GlobalFormsComponentsModule} from "../../shared/components/forms/global-forms.module";


@NgModule({
  declarations: [
    UsuariosComponent,
    RegistrarUsuarioComponent,
    EditarUsuarioComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SharedModule,
    GlobalFormsComponentsModule
  ]
})
export class UsuariosModule { }
