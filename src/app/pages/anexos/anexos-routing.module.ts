import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AnexosComponent} from "./components/anexos.component";

const routes: Routes = [
  { path: '', component: AnexosComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AnexosRoutingModule { }
