import { CommonModule } from "@angular/common";
import { ReporteComponent } from "./components/reporte.component";
import { ReportesRoutingModule } from "./reporte-routing.module";
import {MessageModule} from "primeng/message";
import {SharedModule} from "../../shared/shared.module";
import { NgModule } from "@angular/core";


@NgModule({
  declarations: [
    ReporteComponent
  ], 
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    MessageModule
  ]
})
export class ReportesModule { }

