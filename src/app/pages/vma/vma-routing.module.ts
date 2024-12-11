import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {VmaComponent} from "./components/vma-list/vma.component";
import { ESTADO_COMPLETO, ESTADO_INCOMPLETO, ESTADO_SIN_REGISTRO, 
  ROL_ADMINISTRADOR_DF, ROL_REGISTRADOR,ROL_CONSULTOR  } from 'src/app/utils/var.constant';
import { RegistrarVmaComponent } from './components/registrar-vma/registrar-vma.component';
import { RegistradorVmaGuard } from './components/registrar-vma/registrador-vma.guard';

  const routes: Routes = [
    {
      path: '', component: VmaComponent
    },
    {
      path: "registrar-vma", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRole: ROL_REGISTRADOR }, canActivate: [RegistradorVmaGuard]
    },
    {
      path: "registrar-vma/:id", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRoles: [ROL_ADMINISTRADOR_DF, ROL_CONSULTOR]}
     // path: "registrar-vma/:id", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRole: [ROL_REGISTRADOR, ROL_ADMINISTRADOR_DF, ROL_CONSULTOR]}, canActivate: [RegistradorVmaGuard] 
    
    },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VmaRoutingModule { }
