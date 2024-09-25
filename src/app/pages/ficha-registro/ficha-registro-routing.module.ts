import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FichaRegistroComponent} from "./components/register-ficha/ficha-registro.component";

const routes: Routes = [
  {
    path: '', component: FichaRegistroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FichaRegistroRoutingModule { }
