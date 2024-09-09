import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { ReporteComponent } from 'src/app/pages/reporte/components/reporte.component';
import { UsuariosComponent } from './pages/usuarios/components/usuarios.component';
import { GuardService } from './_service/guard.service';
import { EmpresaComponent } from './pages/empresa/components/empresa.component';
import { FichaRegistroComponent } from 'src/app/pages/ficha-registro/components/ficha-registro.component';
import { AnexosComponent } from 'src/app/pages/anexos/components/anexos.component';
import { RegistrarUsuarioComponent } from './pages/usuarios/components/registrar-usuario/registrar-usuario.component';
import { EditarUsuarioComponent } from './pages/usuarios/components/editar-usuario/editar-usuario.component';
import { VmaComponent } from './pages/vma/components/vma.component';
import { RegistrarVmaComponent } from './pages/vma/registrar-vma/registrar-vma.component';
import { RegistradorVmaGuard } from './_service/registrador-vma.guard';
import { AnexoGuard } from './_service/anexo.guard';



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
            path : 'vma', component : VmaComponent, canActivate : [GuardService]
          },
          {
            path: "vma/registrar-vma", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles', expectedRole: 'REGISTRADOR' }, canActivate: [GuardService, RegistradorVmaGuard]
          },
          {
            path: "vma/registrar-vma/:id", component : RegistrarVmaComponent, data: { tituloModulo : 'Sistema de Valores Maximos Admisibles' }, canActivate: [GuardService]
          },
          {
            path : 'reporte', component : ReporteComponent, canActivate : [GuardService]
          },
          {
            path : 'anexos', component : AnexosComponent, canActivate : [GuardService, AnexoGuard], data: {expectedRoles: ['ADMINISTRADOR DAP', 'CONSULTOR', 'REGISTRADOR']}
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