import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VmaRoutingModule } from './vma-routing.module';
import {RegistrarVmaComponent} from "./components/registrar-vma/registrar-vma.component";
import {VmaComponent} from "./components/vma-list/vma.component";
import {SharedModule} from "../../shared/shared.module";
import {GlobalFormsComponentsModule} from "../../shared/components/forms/global-forms.module";

@NgModule({
  declarations: [
    RegistrarVmaComponent,
    VmaComponent
  ],
  imports: [
    CommonModule,
    VmaRoutingModule,
    SharedModule,
    GlobalFormsComponentsModule
  ]
})
export class VmaModule { }