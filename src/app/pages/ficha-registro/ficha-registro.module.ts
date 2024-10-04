import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FichaRegistroRoutingModule } from './ficha-registro-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {RegisterEditFichaComponent} from "./components/register-edit-ficha/register-edit-ficha.component";
import {FichaRegistroComponent} from "./components/register-ficha/ficha-registro.component";
import {GlobalFormsComponentsModule} from "../../shared/components/forms/global-forms.module";


@NgModule({
  declarations: [
    RegisterEditFichaComponent,
    FichaRegistroComponent
  ],
  imports: [
    CommonModule,
    FichaRegistroRoutingModule,
    SharedModule,
    GlobalFormsComponentsModule
  ]
})
export class FichaRegistroModule { }
