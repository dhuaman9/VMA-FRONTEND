import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { LoginComponent } from './pages/login/login.component';
import { ModulosComponent } from './pages/modulos/modulos.component';
import { ReporteComponent } from 'src/app/pages/reporte/components/reporte.component';
import { GuardService } from './_service/guard.service';
import { AnexoGuard } from 'src/app/pages/anexos/anexo.guard';

const routes : Routes = 
  [
    { path : 'login', component : LoginComponent},
    { path : 'modulos', component : ModulosComponent, canActivate : [GuardService] },
    { path : 'inicio', component : InicioComponent , children :
        [
          {
            path: 'usuarios',
            canActivate : [GuardService],
            loadChildren: () => import('./pages/usuarios/usuarios.module').then(m => m.UsuariosModule)
          },
          {
            path: 'anexos',
            canActivate : [GuardService, AnexoGuard],
            data: {expectedRoles: ['ADMINISTRADOR DAP', 'CONSULTOR', 'REGISTRADOR']},
            loadChildren: () => import('./pages/anexos/anexos.module').then(m => m.AnexosModule)
          },
          {
            path: 'empresa',
            canActivate : [GuardService],
            loadChildren: () => import('./pages/empresa/empresa.module').then(m => m.EmpresaModule)
          },
          {
            path: 'ficha-registro',
            canActivate : [GuardService],
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
