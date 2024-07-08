import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { ReporteComponent } from './pages/reporte/reporte.component';
import { ReportesParametroCalidadComponent } from './pages/reportes/reportes-parametro-calidad/reportes-parametro-calidad.component';
import { ReportesVariableGestionComponent } from './pages/reportes/reportes-variable-gestion/reportes-variable-gestion.component';
import { ReportesVariableOperacionalComponent } from './pages/reportes/reportes-variable-operacional/reportes-variable-operacional.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { GuardService } from './_service/guard.service';
import { EmpresaComponent } from './pages/empresa/empresa.component';
import { FichaRegistroComponent } from './pages/ficha-registro/ficha-registro.component';
import { AnexosComponent } from './pages/anexos/anexos.component';
import { RegistrarUsuarioComponent } from './pages/usuarios/registrar-usuario/registrar-usuario.component';
import { EditarUsuarioComponent } from './pages/usuarios/editar-usuario/editar-usuario.component';
import { VmaComponent } from './pages/vma/vma.component';
import { RegistrarVmaComponent } from './pages/vma/registrar-vma/registrar-vma.component';
import { RegistradorVmaGuard } from './_service/registrador-vma.guard';



const routes : Routes = 
[
  { path : 'login', component : LoginComponent},
  { path : 'modulos', component : ModulosComponent, canActivate : [GuardService] },
  { path : 'inicio', component : InicioComponent , children :  
    [
      {
        path : 'usuarios', component : UsuariosComponent, canActivate : [GuardService] , children :
        [
          { path: "registrar-usuario", component : RegistrarUsuarioComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' } },
          { path: "editar-usuario/:id", component : EditarUsuarioComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' } }
          
        ]
      },
      {
        path : 'empresa', component : EmpresaComponent, canActivate : [GuardService] 
      },
      {
        path : 'ficha-registro', component : FichaRegistroComponent, canActivate : [GuardService] 
      },
      {
        path : 'vma', component : VmaComponent, canActivate : [GuardService] , children :
        [
          { path: "registrar-vma", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRole: 'REGISTRADOR' }, canActivate: [RegistradorVmaGuard] },
          { path: "registrar-vma/:id", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' } }
        ]
      },
      {
        path : 'reporte', component : ReporteComponent, canActivate : [GuardService] 
      },
      {
        path : 'anexos', component : AnexosComponent, canActivate : [GuardService] 
      }
    //] , canActivate : [GuardService], data: { tituloModulo : 'Variables de gestión', menuOption : 'submenu-option-variable-gestion' }
  ]
  },
  { path : '', redirectTo : 'login', pathMatch:'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
