import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { ReporteComponent } from 'src/app/pages/reporte/components/reporte.component';
import { GuardService } from './_service/guard.service';
import { AnexoGuard } from 'src/app/pages/anexos/anexo.guard';
import {  ROL_ADMINISTRADOR_DAP,ROL_CONSULTOR, ROL_ADMINISTRADOR_OTI,ROL_REGISTRADOR  } from 'src/app/utils/var.constant';
import { UsuarioGuard } from './pages/usuarios/usuario.guard';
import { EmpresaGuard } from './pages/empresa/empresa.guard';
import { FichaRegistroGuard } from './pages/ficha-registro/ficha-registro.guard';
import {CambiarPasswordComponent} from "./pages/usuarios/components/cambiar-password/cambiar-password.component";
import {CambiarPasswordGuard} from "./pages/usuarios/guards/cambiar-password.guard";

const routes : Routes =
  [
    { path : 'login', component : LoginComponent},
    { path : 'modulos', component : ModulosComponent, canActivate : [GuardService] },
    { path : 'inicio', component : InicioComponent , children :
        [
          {
            path: 'usuarios',
            canActivate : [GuardService, UsuarioGuard],
            data: {expectedRoles: [ROL_ADMINISTRADOR_OTI]},
            loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule)
          },
          {
            path: 'cambiar-password',
            component: CambiarPasswordComponent,
            canActivate: [GuardService, CambiarPasswordGuard]
          },
          {
            path: 'anexos',
            canActivate : [GuardService, AnexoGuard],
            data: {expectedRoles: [ROL_ADMINISTRADOR_DAP, ROL_CONSULTOR]},
            loadChildren: () => import('./pages/anexos/anexos.module').then(m => m.AnexosModule)
          },
          {
            path: 'empresa',
            canActivate : [GuardService , EmpresaGuard],
            data: {expectedRoles: [ROL_ADMINISTRADOR_DAP]},
            loadChildren: () => import('./pages/empresa/empresa.module').then(m => m.EmpresaModule)
          },
          {
            path: 'ficha-registro',
            canActivate : [GuardService , FichaRegistroGuard],
            data: {expectedRoles: [ROL_ADMINISTRADOR_DAP]},
            loadChildren: () => import('./pages/ficha-registro/ficha-registro.module').then(m => m.FichaRegistroModule)
          },
          {
            path: 'vma',
            canActivate : [GuardService],
            loadChildren: () => import('./pages/vma/vma.module').then(m => m.VmaModule)
          },
          {
            path : 'reporte', component : ReporteComponent, canActivate : [GuardService]
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
