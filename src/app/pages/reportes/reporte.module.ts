import { CommonModule } from "@angular/common";
import { ReporteComponent } from "./components/reporte.component";
import { ReportesRoutingModule } from "./reporte-routing.module";
import {MessageModule} from "primeng/message";
import {SharedModule} from "../../shared/shared.module";
import { NgModule } from "@angular/core";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";


@NgModule({
  declarations: [
    ReporteComponent,
    PieChartComponent,
    BarChartComponent
  ], 
  imports: [
    CommonModule,
    ReportesRoutingModule,
    SharedModule,
    MessageModule
  ]
})
export class ReportesModule { }

