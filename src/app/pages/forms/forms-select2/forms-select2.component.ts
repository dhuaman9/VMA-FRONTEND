import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Option } from 'src/app/_model/option';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-forms-select2',
  templateUrl: './forms-select2.component.html',
  styleUrls: ['./forms-select2.component.css']
})
export class FormsSelect2Component implements OnInit {

  @Input() label: string;
  @Input() iconoToLabel: string = "";

  @Input() forLabel: string;
  @Input() classForLabel: string = "";
  @Input() classIconoForLabel: string = "";

  @Input() id: string;
  @Input() placeholder: string;

  @Input() options: Option[];

  @Input() messageError: string;
  @Input() typeError: string;

  @Input() classForNgSelect: string = "";

  @Output() changeOptions = new EventEmitter<void>();

  selectedOption: string;

  @Input() inputSelectedOption: string;

  @ViewChild('ngSelectComponent') ngSelectComponent: NgSelectComponent;

  @Input() idHidden: string;

  @Input() keyOnlyLetras: boolean = false;

  @Input() keyOnlyNumber: boolean = false;

  private innerValue: any;

  constructor(private renderer: Renderer2, private config: NgSelectConfig) { 
    this.options = [];
    this.config.notFoundText = 'No hay resultados';
  }

  ngOnInit(): void {
    this.selectedOption = this.inputSelectedOption;
  }

  ngOnChanges(): void{

    if(this.inputSelectedOption == null){
      this.selectedOption = null;
    }

  }

  onChange($event) {
    this.inputSelectedOption = null;
    this.changeOptions.emit($event);
  }

  onKeyPress($event){
    if(this.keyOnlyLetras == false && this.keyOnlyNumber == false){
      return true;
    }
    else{
      if(this.keyOnlyLetras){
        return this.onKeyOnlyLetra($event);
      }
      else if(this.keyOnlyNumber){
        return this.onKeyOnlyNumber($event);
      }
      else{
        return true;
      }
    }
  }

  onKeyOnlyLetra($event){
    let key = $event.keyCode || $event.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    let especiales = [8,37,39,46];

    let tecla_especial = false

    for(var i in especiales){
        if(key == especiales[i]){
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla)==-1 && !tecla_especial){
        return false;
    }

    return true;
  }

  onKeyOnlyNumber($event){
    let key = $event.keyCode || $event.which;
    let tecla = String.fromCharCode(key).toLowerCase();
    let letras = "0123456789";

    if(letras.indexOf(tecla)==-1){
        return false;
    }

    return true;
  }

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
    }
  }

  public formatHtmlTolabel(){
    return this.iconoToLabel=="" ? this.label : "<img src='"+ this.iconoToLabel +"' class='"+this.classIconoForLabel+"'> "+this.label;
  }
}
