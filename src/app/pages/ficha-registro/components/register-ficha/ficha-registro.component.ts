import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParamsPagination } from 'src/app/_dto/params-pagination';

import { Table } from 'primeng/table';
import { DialogService } from 'primeng/dynamicdialog';
import { FichaRegistro } from 'src/app/pages/ficha-registro/models/fichaRegistro';
import { FichaRegistroService } from 'src/app/pages/ficha-registro/services/ficha-registro.service';
import { RegisterEditFichaComponent } from 'src/app/pages/ficha-registro/components/register-edit-ficha/register-edit-ficha.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-ficha-registro',
  templateUrl: './ficha-registro.component.html',
  styleUrls: ['./ficha-registro.component.css'],
  providers: [DialogService]
})
export class FichaRegistroComponent implements OnInit {


  isLoading = false;
  showResultados = false;
  isEdition = false;
  fichaRegistro : FichaRegistro;
  ListFichasRegistro: FichaRegistro[];
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
 
  constructor(public route : ActivatedRoute,
    private router: Router,
    private fichaRegistroService : FichaRegistroService,
    private fb: FormBuilder,
    private dialogService: DialogService) {
      this.paramsPagination = new ParamsPagination(0,1,10,0);
     }

  ngOnInit(): void {

   this.initListFicha();
   this.fichaRegistro = new FichaRegistro();
 
   this.registroForm = this.fb.group({
    anio: ['', Validators.required],
    fechaInicio: ['', Validators.required],
    fechaFin: ['', Validators.required]
   });

  }

  initListFicha() {
    this.showResultados = false;
    this.paramsPagination = new ParamsPagination(0,1,10,0);
    this.onQueryPageFicha();
    
  }

  onQueryPageFicha() {   //paramsPag: ParamsPagination
   // console.log("paramsPag",paramsPag);
    this.fichaRegistroService.findAll().subscribe(
     
      (data:any) => {
      this.ListFichasRegistro= (data.content || data).map((item: FichaRegistro,index: number)=>({
        ...item,
        index: index + 1
      }));
      this.showResultados = true;
      this.totalRecords = data.totalElements || this.ListFichasRegistro.length;
      this.isLoading = false;
      },
      error => {
        console.error('No se encontro datos de fichas de registros', error);
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

 addFichaRegistro() {
    this.isEdition = false;
    this.openModalAddEditFicha(0, 'Aperturar Ficha de Registro VMA');
  }
 
  onEditFichaRegistro(idFichaRegistro: number) {
    this.isEdition = true;
    this.openModalAddEditFicha(idFichaRegistro, 'Actualizar Ficha de Registro VMA');
  }


  private openModalAddEditFicha(idFichaRegistro: number, titleModal: string){
 
    const refDialog = this.dialogService.open(RegisterEditFichaComponent, {
      data: {
        'idFichaRegistro': idFichaRegistro,
        'titleHeader': titleModal
      },
      header: titleModal,
      width:'70%',
      height:'55%',
      showHeader: false,
      styleClass: 'dialog-for-display-default'
    });

    refDialog.onClose.subscribe((resultado: boolean) => {

      if (resultado) {
       
      // this.displayModaAdvice = true;
      //  this.modalImage = './assets/images/accept-icon.png';
        let msj = "";
        if(this.isEdition){
         // this.modalMessage = 'Se editó la ficha de registro de manera correcta';
          msj = "Se editó la ficha de registro de manera correcta";
        } else {
         // this.modalMessage = 'Se registró la ficha de registro de manera correcta';
          msj = "Se registró la ficha de registro de manera correcta";
          this.onAccept();
        }
        
        Swal.fire({
          icon: "success",
          title: msj,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745', // color verde
          timer: 2000
        });


        //this.paramsPagination = new ParamsPagination(0,1,10,0);
        this.onQueryPageFicha();
      } 
    
    });
  
  }



}
