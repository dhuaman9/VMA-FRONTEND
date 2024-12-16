import { RouterModule, Routes } from "@angular/router";
import { ReporteComponent } from "./components/reporte.component";
import { NgModule } from "@angular/core";


const routes: Routes = [
  { path: '', component: ReporteComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }