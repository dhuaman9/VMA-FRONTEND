import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RegistrarUsuarioComponent} from "./components/registrar-usuario/registrar-usuario.component";
import {EditarUsuarioComponent} from "./components/editar-usuario/editar-usuario.component";
import {UsuariosComponent} from "./components/usuarios-list/usuarios.component";

const routes: Routes = [
  { path: "", component : UsuariosComponent },
  { path: "registrar-usuario", component : RegistrarUsuarioComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' } },
  { path: "editar-usuario/:id", component : EditarUsuarioComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
