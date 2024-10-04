import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {AltaEditEmpresaComponent} from "./components/alta-edit-empresa/alta-edit-empresa.component";
import {EmpresaComponent} from "./components/empresas/empresa.component";
import {GlobalFormsComponentsModule} from "../../shared/components/forms/global-forms.module";


@NgModule({
  declarations: [
    AltaEditEmpresaComponent,
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    SharedModule,
    GlobalFormsComponentsModule
  ]
})
export class EmpresaModule { }
