import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VmaComponent} from "./components/vma-list/vma.component";
import {RegistrarVmaComponent} from "./components/registrar-vma/registrar-vma.component";
import {RegistradorVmaGuard} from "../../_service/registrador-vma.guard";

const routes: Routes = [
  {
    path: '', component: VmaComponent
  },
  {
    path: "registrar-vma", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRole: 'REGISTRADOR' }, canActivate: [RegistradorVmaGuard]
  },
  {
    path: "registrar-vma/:id", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VmaRoutingModule { }
