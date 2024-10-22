import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';
import { Empresa } from 'src/app/pages/empresa/models/empresa';
import { EmpresaService } from 'src/app/pages/empresa/services/empresa.service';
import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { AltaEditEmpresaComponent } from '../alta-edit-empresa/alta-edit-empresa.component';
import { PageableResponse } from 'src/app/_model/pageableResponse';
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";


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
  registroForm: FormGroup;
  filterFC: FormControl = new FormControl('');

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

  @ViewChild('dt1') myTable: Table;
   constructor(
    public route : ActivatedRoute,
    private router: Router,
    private empresaService : EmpresaService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
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

    this.filterFC.valueChanges
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        tap(text => {
          if(text.length === 0){
            this.setearPaginacionPorDefecto();
          }
          this.loadEmpresasLazy({ first: 0, rows: this.size });
        })
      )
      .subscribe();
  }

  private setearPaginacionPorDefecto(): void {
    this.myTable.first = 0;
    this.myTable.rows = 10;
    this.cdr.detectChanges();
  }

  async loadEmpresasLazy(event: any) {
    this.isLoading = true;
    const page = event.first / event.rows;
    this.empresaService.findAllPageable(page, event.rows, this.filterFC.value).subscribe((data: any) => {
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

  /*print(a:any){
    return JSON.stringify(a);
  }*/



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
    if(resultado) {
      this.loadEmpresasLazy({ first: 0, rows: this.size });
    }

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