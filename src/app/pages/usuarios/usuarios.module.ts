import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import {UsuariosComponent} from "./components/usuarios-list/usuarios.component";
import {RegistrarUsuarioComponent} from "./components/registrar-usuario/registrar-usuario.component";
import {EditarUsuarioComponent} from "./components/editar-usuario/editar-usuario.component";
import {SharedModule} from "../../shared/shared.module";
import {GlobalFormsComponentsModule} from "../../shared/components/forms/global-forms.module";
import { CambiarPasswordComponent } from './components/cambiar-password/cambiar-password.component';
import {CardModule} from "primeng/card";


@NgModule({
  declarations: [
    UsuariosComponent,
    RegistrarUsuarioComponent,
    EditarUsuarioComponent,
    CambiarPasswordComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    SharedModule,
    GlobalFormsComponentsModule,
    CardModule
  ]
})
export class UsuariosModule { }
