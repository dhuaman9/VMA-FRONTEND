import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidateInputsFormComponent } from './validate-inputs-form/validate-inputs-form.component';




@NgModule({
  declarations: [
    ValidateInputsFormComponent
    
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReactiveFormsModule,
    ValidateInputsFormComponent,
 
  ]
})
export class GlobalFormsComponentsModule { }