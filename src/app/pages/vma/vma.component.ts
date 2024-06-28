import { Component, OnInit } from '@angular/core';
import {MessageService} from 'primeng/api';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Empresa } from 'src/app/_model/empresa';
import { RegistroVMA } from 'src/app/_model/registroVMA';
import { RegistroVMAService } from 'src/app/_service/registroVMA.service';
import { Table } from 'primeng/table';



@Component({
  selector: 'app-vma',
  templateUrl: './vma.component.html',
  styleUrls: ['./vma.component.css']
})
export class VmaComponent implements OnInit {

  activeState: boolean[] = [true, false, false];

  value1: number = 0;
  inputFilterTable: string="";
  

  isLoading = false;
  showResultados = false;
  isEdition = false;
  empresa : Empresa;
  ListEmpresa: Empresa[];  // x quedar en desuso
  ListRegistroVMA: RegistroVMA[];  //pendiente
  registroForm: FormGroup;


  first = 0;
  rows = 10;
  totalRecords = 0;

 // displayModaAdvice = false;

 //paginacion
  /* currentPage: number= 0;
   paramsPagination: ParamsPagination;
   numeroPagina: number = 0;*/
  
  constructor(  public route : ActivatedRoute,
    private router: Router,
    private registroVMAService : RegistroVMAService,
    private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.initListRegistroVMA();
  //  this.empresa = new Empresa();
  }

  initListRegistroVMA() {
    this.showResultados = false;
   // this.paramsPagination = new ParamsPagination(0,1,10,0); //?
    this.onQueryListRegistroVMA();  //dhr
  }


 /* onTabClose(event) {
    this.messageService.add({severity:'info', summary:'Tab Closed', detail: 'Index: ' + event.index})
  }

  onTabOpen(event) {
      this.messageService.add({severity:'info', summary:'Tab Expanded', detail: 'Index: ' + event.index});
  }*/

   
   onQueryListRegistroVMA(event?: any) {

   // this.isLoading = true;
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : this.rows;
    //console.log("paramsPag",paramsPag);
    this.registroVMAService.findAll().subscribe(
     
      (data:any) => {
        console.log("params ",data);
      this.ListRegistroVMA= data.content || data;
      this.showResultados = true;
      this.totalRecords = data.totalElements || this.ListRegistroVMA.length;
      this.isLoading = false;
      },
      error => {
        console.error('Error, no hay data de registro VMA', error);
      }
    );
  }

 
  
  onFilterTableGlobal(table: Table, event:any){

    const filterValue = (event.target as HTMLInputElement).value;
    if (table) {
      table.filterGlobal(filterValue, 'contains');
      
    }
  console.log("filterValue-",filterValue);
  }
  /**
   *   onFilterTableGlobal(dt: any, event: Event): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
   * 
   * 
   */



  redirectToForm(){
    this.router.navigate(['/inicio/vma/registrar-vma']);
  }
  onEditEmpresa(){
    alert("editar empresa");
  }

  redirectToFormUpdate(){
    this.router.navigate(['/inicio/vma/registrar-vma']);// temporal, luego se setea el ID del registro , en el metodo anterior redirectToForm
  }

}
