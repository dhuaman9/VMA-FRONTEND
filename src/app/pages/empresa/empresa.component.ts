import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Empresa } from 'src/app/_model/empresa';
import { EmpresaService } from 'src/app/_service/empresa.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { AltaEditEmpresaComponent } from './alta-edit-empresa/alta-edit-empresa.component';
import { PageableResponse } from 'src/app/_model/pageableResponse';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css'],
  providers: [DialogService]
})
export class EmpresaComponent implements OnInit {
  
  isLoading = false;
  isEdition = false;
  empresa : Empresa;
  pageable: PageableResponse<Empresa[]>;
  size: number = 10;
  filter: string = '';
  registroForm: FormGroup;

  displayModaAdvice = false;
  modalImage ='';
  modalMessage = '';

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
  }

  ngOnInit(): void {
    this.loadEmpresasLazy({ first: 0, rows: this.size });
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      regimen: ['', Validators.required],
      estado: [true]
    });
  }
  
  async loadEmpresasLazy(event: any) {
    this.isLoading = true;
    const page = event.first / event.rows; 
    this.empresaService.findAllPageable(page, event.rows, this.filter).subscribe((data: any) => {
      this.pageable = data;
      console.log('this.pageable',this.pageable);
      this.isLoading = false;
    }, (error) => {
      console.error('No se encontro datos de la empresa.', error);
      this.isLoading = false;
    });
  }

  onFilterChange() {
    this.loadEmpresasLazy({ first: 0, rows: this.size });
  }

  print(a:any){
    console.log(a);
    return JSON.stringify(a);
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