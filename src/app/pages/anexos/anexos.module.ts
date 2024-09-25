import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnexosRoutingModule } from './anexos-routing.module';
import {AnexosComponent} from "./components/anexos.component";
import {MessageModule} from "primeng/message";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
  declarations: [
    AnexosComponent
  ],
  imports: [
    CommonModule,
    AnexosRoutingModule,
    SharedModule,
    MessageModule
  ]
})
export class AnexosModule { }
