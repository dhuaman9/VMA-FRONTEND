import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Empresa } from 'src/app/_model/empresa';
import { EmpresaService } from 'src/app/_service/empresa.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { AltaEditEmpresaComponent } from './alta-edit-empresa/alta-edit-empresa.component';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
  providers: [DialogService]
})
export class EmpresaComponent implements OnInit {


  isLoading = false;
  showResultados = false;
  isEdition = false;
  empresa : Empresa;
  ListEmpresa: Empresa[];
  registroForm: FormGroup;

  displayModaAdvice = false;
  modalImage ='';
  modalMessage = '';
 
 //paginacion
   currentPage: number= 0;
   paramsPagination: ParamsPagination;
   numeroPagina: number = 0;

   first = 0;
   rows = 10;
   totalRecords = 0;

  regimenOptions: any[] = [
    { label: 'RAT', value: 'RAT' },
    { label: 'NO RAT', value: 'NO RAT' }
  ];
  tipoOptions: any[] = [
    { label: 'PEQUEÑA', value: 'PEQUEÑA' },
    { label: 'MEDIANA', value: 'MEDIANA' },
    { label: 'GRANDE', value: 'GRANDE' },
    { label: 'SEDAPAL', value: 'SEDAPAL' }
  ];

   constructor(
    public route : ActivatedRoute,
    private router: Router,
    private empresaService : EmpresaService,
    private fb: FormBuilder,
    private dialogService: DialogService) {
    
    this.paramsPagination = new ParamsPagination(0,1,10,0);
 
  }

  ngOnInit(): void {
   this.initListEmpresa();
   
   this.registroForm = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['', Validators.required],
    regimen: ['', Validators.required],
    estado: [true]
  });

  

  }
  
  initListEmpresa() {
    this.showResultados = false;
   // this.paramsPagination = new ParamsPagination(0,1,10,0); //?
    this.onQueryPageEmpresa();  //dhr
  }

 /**
   * Funcion para el listado de empresas  en la tabla
   * 
   */
 onQueryPageEmpresa() {
   
  this.empresaService.findAll().subscribe(
    (data:any) => {
    console.log("params ",data);
    this.ListEmpresa = (data.content || data).map((item: Empresa,index: number)=>({
      ...item,
      index: index + 1
    }));
    this.showResultados = true;
    this.totalRecords = data.totalElements || this.ListEmpresa.length;
    this.isLoading = false;
    },
    error => {
      console.error('No se encontro datos de la empresa.', error);
    }
  );
}

onFilterTableGlobal(table: Table, event:any){

  const filterValue = (event.target as HTMLInputElement).value;
  if (table) {
    table.filterGlobal(filterValue, 'contains');
  }

}



onCancel(){
  this.displayModaAdvice = false;
}


onAccept(){
  this.displayModaAdvice = false;
}

onAddEmpresa() {
  this.isEdition = false;
  this.openModalAddEditEmpresa(0, 'Formulario de Registro');
}

onEditEmpresa(idEmpresa: number) {
  this.isEdition = true;
  this.openModalAddEditEmpresa(idEmpresa, 'Formulario de Edición');
}
private openModalAddEditEmpresa(idEmpresa: number, titleModal: string){

  const refDialog = this.dialogService.open(AltaEditEmpresaComponent, {
    data: {
      'idEmpresa': idEmpresa,
      'titleHeader': titleModal
    },
    header: titleModal,
    showHeader: false,
    styleClass: 'dialog-for-display-default',
    baseZIndex: 100000
  });

  refDialog.onClose.subscribe((resultado: boolean) => {

    /*if (resultado) {
      console.log('se cerro modal y se muestra valor de resultado', resultado);

      this.displayModaAdvice = true;
      this.modalImage = './assets/images/accept-icon.png';
      if(this.isEdition){
        this.modalMessage = 'Se editó la empresa de manera correcta';
      } else {
        this.modalMessage = 'Se registró la empresa de manera correcta';
      }
      
    //  this.paramsPagination = new ParamsPagination(0,1,10,0); //?
      this.onQueryPageEmpresa();  //dhr
    }*/ /*else {
      this.displayModaAdvice = true;
      this.modalImage = './assets/images/cancel-icon.png';
      if(this.isEdition){
        this.modalMessage = 'Edición cancelada';
      } else {
        this.modalMessage = 'Registro cancelado';
      }
    }*/
  });

}

}
