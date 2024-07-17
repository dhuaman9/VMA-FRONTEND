import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import {MessageService} from 'primeng/api';
import { RegistroVmaRequest } from 'src/app/_model/registroVMARequest';
import { RespuestaDTO } from 'src/app/_model/respuestaRequest';
import { Alternativa } from 'src/app/_model/alternativa';
import { Cuestionario } from 'src/app/_model/cuestionario';
import { Pregunta } from 'src/app/_model/pregunta';
import { TipoPregunta } from 'src/app/_model/tipo-pregunta';
import { CuestionarioService } from 'src/app/_service/cuestionario.service';
import { VmaService } from 'src/app/_service/vma.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/_service/session.service';
import { UploadService } from 'src/app/_service/upload.service';


@Component({
  selector: 'app-registrar-vma',
  templateUrl: './registrar-vma.component.html',
  styleUrls: ['./registrar-vma.component.css'],
  providers: [MessageService]
})


export class RegistrarVmaComponent implements OnInit {
  cuestionario: Cuestionario;
  registroForm: FormGroup;
  //formAdjuntar: FormGroup;// sera un form estatico con los botones de adjuntar archivos

  formularioGeneral: FormGroup;
  idRegistroVMA: number = null;
  formularioValido: boolean = false;
  seccionActiva: number; // Variable para almacenar el índice de la sección activa

  isGreenTab = true; // para cambiar al color verde en el tab
  registroCompletoPorEPS: Observable<boolean>;
  isRoleRegistrador: boolean = this.sessionService.obtenerRoleJwt().toUpperCase() === 'REGISTRADOR';
  formGroupPregunta: FormGroup;
  secciones: FormArray;
  preguntasAuxiliar: Pregunta[] = [];
  // pdfFormControl: FormControl = new FormControl(null, [this.fileValidator([FileType.PDF], 5)]);
  // pdfOrWordFormControl: FormControl = new FormControl(null, this.fileValidator([FileType.DOC, FileType.DOCX], 20));
  // excelFormControl: FormControl = new FormControl(null, this.fileValidator([FileType.XLS, FileType.XLSX], 10));
  filesFormGroup = new FormGroup({
    pdf: new FormControl(null, [this.fileValidator([FileType.PDF], 5)]),
    pdfWord: new FormControl(null, this.fileValidator([FileType.DOC, FileType.DOCX], 20)),
    excel: new FormControl(null, this.fileValidator([FileType.XLS, FileType.XLSX], 10))
  })

  constructor(
    private router: Router,
    private fb: FormBuilder, 
    private cuestionarioService: CuestionarioService,
    private vmaService: VmaService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private uploadService: UploadService
  ) {
    this.formularioGeneral = this.fb.group({
      secciones: this.fb.array([])
    });

  }

  ngOnInit(): void {

  this.registroForm = this.fb.group({
    tipo: ['EPS', Validators.required],
    perfil: ['', Validators.required],
    unidadOrganica: [''],
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    eps: ['', Validators.required],
    usuario: [''],
    username: [''],
    password: ['', Validators.required],
    telefono: ['', Validators.required],
    estado: [true]
  });

 /* this.formAdjuntar = new FormGroup({

  })*/

  this.activatedRoute.params.subscribe(params => {
    this.idRegistroVMA = params['id'];

    if(this.idRegistroVMA) {
      this.cuestionarioService.cuestionarioConRespuestas(this.idRegistroVMA).subscribe((response: any) => {
        this.cuestionario = response.item;
        this.buildForm();
      })
    } else {
      this.cuestionarioService.findCuestionarioByIdMax().subscribe((response: any) => {
        this.cuestionario = response.item;
        this.buildForm();
      })
    }
  })
  }

  guardar(isGuardadoCompleto: boolean){
    const preguntasArray = this.formularioGeneral.value.secciones.map(seccion => seccion.preguntas);
    let preguntas: Pregunta[] = preguntasArray.reduce((acc, cur) => acc.concat(cur), []);
    const respuestas: RespuestaDTO[] = [];
    preguntas = preguntas.filter(pregunta => pregunta.respuesta || (pregunta.tipoPregunta === TipoPregunta.NUMERICO && pregunta.alternativas.length > 0))
    preguntas.forEach(pregunta => {
      if(pregunta.tipoPregunta === TipoPregunta.NUMERICO && pregunta.alternativas.length > 0) {
        pregunta.alternativas.forEach(alternativa => {
          if(alternativa.respuesta) {
            const respuesta = new RespuestaDTO();
            respuesta.idRespuesta = alternativa.respuestaDTO?.idRespuesta;
            respuesta.idPregunta = pregunta.idPregunta;
            respuesta.respuesta = alternativa.respuesta;
            respuesta.idAlternativa = alternativa.idAlternativa;
            respuesta.idRegistroVMA = this.idRegistroVMA;
            respuestas.push(respuesta);
          }
        })
      } else {
        respuestas.push(this.mapToRespuestaDTO(pregunta));
      }
    })

    if(respuestas.length === 0) {
      
      Swal.fire('Guardado progresivo', 'Debe responder al menos una pregunta','info');
      return;
    }

    const registroVMA = new RegistroVmaRequest();
    registroVMA.registroValido = isGuardadoCompleto;
   // registroVMA.idEmpresa = 1;   //temporal, hasta definir
    registroVMA.respuestas = respuestas;
    const files: any[] = [];

    if(this.filesFormGroup.get('pdf').value) {
      files.push({type: 'pdf', file: this.filesFormGroup.get('pdf').value}) 
    }

    if(this.filesFormGroup.get('pdfWord').value) {
      files.push({type: 'pdfWord', file: this.filesFormGroup.get('pdfWord').value})
    }

    if(this.filesFormGroup.get('excel').value) {
      files.push({type: 'excel', file: this.filesFormGroup.get('excel').value})
    }

    console.log("this.idRegistroVMA -",this.idRegistroVMA);
    console.log("registroVMA -",registroVMA.respuestas);

    if(this.idRegistroVMA) {
      if(files.length) {
        this.uploadService.uploadFiles(files).subscribe(() => console.log("success"))
      }
      this.vmaService.updateRegistroVMA(this.idRegistroVMA, registroVMA)
          .subscribe(
            () => {
              Swal.fire({
                title: isGuardadoCompleto ? 'Registro completado': 'Registro actualizado',
                ///text: isGuardadoCompleto ? 'Su información ha sido registrada y enviada.' : 'Se ha realizado el guardado progresivo',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false  //evita hacer click fuera del alert
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/inicio/vma']).then(() => {
                     window.location.reload();
                    //temporal, no  recomendable
                  });
                }
              });
            }
          );
    } else {
      if(files.length) {
        this.uploadService.uploadFiles(files).subscribe(() => console.log("success"))
      }
      
      this.vmaService.saveRegistroVMA(registroVMA).subscribe(
        () => {
          Swal.fire({
            title: isGuardadoCompleto ? 'Registro completado': 'Registro actualizado',
           // text:  isGuardadoCompleto? 'Su información ha sido registrada y enviada.' : 'Registrado guardado parcialmente',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false    //evita hacer click fuera del alert
          });
       //   this.onBackToList();//temporal, no  recomendable
          this.router.navigate(['/inicio/vma']).then(() => {
                // Es para forzar la recarga del listado por el momento.no recomendable
                 window.location.reload();
              });
          this.vmaService.sendRegistroCompleto(true);
        }
      );
    }
  }

  onFileChange(event: any, formControlName: string) {
    const file = event.target.files[0];
    if (file) {
      console.log(file)
      if(formControlName === 'pdf') {
        this.filesFormGroup.patchValue({
          pdf: file
        })
        
      } else if(formControlName === 'pdfWord') {
        this.filesFormGroup.patchValue({
          pdfWord: file
        })
      }else if(formControlName === 'excel') {
        this.filesFormGroup.patchValue({
          excel: file
        })
      }
      this.filesFormGroup.get(formControlName).updateValueAndValidity();
    }
  }

  private addOrRemoveValidaciones(agregarValidacion: boolean): void {
    if(agregarValidacion) {
      this.filesFormGroup.get('pdf').setValidators([Validators.required, this.fileValidator([FileType.PDF], 5)]);
      this.filesFormGroup.get('excel').setValidators([Validators.required,  this.fileValidator([FileType.XLS, FileType.XLSX], 10)]);
    } else {
      this.filesFormGroup.get('pdf').setValidators([this.fileValidator([FileType.PDF], 5)]);
      this.filesFormGroup.get('excel').setValidators([this.fileValidator([FileType.XLS, FileType.XLSX], 10)]);
    }
    
    this.filesFormGroup.get('pdf').updateValueAndValidity();
    this.filesFormGroup.get('excel').updateValueAndValidity();
  }

  private fileValidator(allowedTypes: string[], numberMB: number): ValidatorFn {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        console.log(file)
        const maxSize = numberMB * 1024 * 1024;
        if (file.size > maxSize) {
          return { maxSize: true };
        }
        if (!allowedTypes.includes(file.type)) {
          return { fileType: true };
        }
      }
      return null;
    };
  }

  guardadoCompleto(): void {
    this.addOrRemoveValidaciones(true);
    console.log(this.filesFormGroup)
    this.addValidatorsToRespuesta(true);
    if(this.formularioValido && this.filesFormGroup.valid) {
      this.guardar(true);
    } else {
      this.formularioGeneral.markAllAsTouched();
      Swal.fire('Registrado final','Para registrar todo, debe llenar el formulario.','info')
    }
  }

  guardadoParcial(): void {
    this.addOrRemoveValidaciones(false);
    this.addValidatorsToRespuesta(false);
    if(this.filesFormGroup.valid) {
      console.log("se guardó")
      this.guardar(false);
    }
  }

  private mapToRespuestaDTO(pregunta: Pregunta): RespuestaDTO {
    const respuesta = new RespuestaDTO();
        respuesta.idRespuesta = pregunta.respuestaDTO?.idRespuesta;
        respuesta.idPregunta = pregunta.idPregunta;
        respuesta.respuesta = pregunta.respuesta;
        respuesta.idRegistroVMA = this.idRegistroVMA;
    return respuesta;
  }

  private buildPregunta = (pregunta: Pregunta) => {
    const preguntaFormGroup = this.fb.group({
      idPregunta: [pregunta.idPregunta],
      texto: [pregunta.descripcion],
      tipoPregunta: [pregunta.tipoPregunta],
      alternativas: this.fb.array(
        pregunta.alternativas.map(alternativa => this.buildAlternativas(alternativa, pregunta.tipoPregunta))
      ),
      respuesta: [pregunta.respuestaDTO?.respuesta],
      respuestaDTO: this.buildRespuestaForm(pregunta.respuestaDTO)
    });

    if(pregunta.tipoPregunta === 'RADIO') {
      this.formGroupPregunta = preguntaFormGroup;
    }

    if (!this.isRoleRegistrador) {
      preguntaFormGroup.disable();
    }

    return preguntaFormGroup;
  }

  buildForm() {
    const formGroup = this.cuestionario.secciones.map(seccion => {
      
      // console.log(seccion)
      const preguntasDependientes = seccion.preguntas.filter(pregunta => !!pregunta.preguntaDependiente);
      if(preguntasDependientes.length > 0) {
        this.preguntasAuxiliar = preguntasDependientes;
      }
      
      seccion.preguntas = seccion.preguntas.filter(pregunta => !pregunta.preguntaDependiente || (pregunta.preguntaDependiente && pregunta.preguntaDependiente.respuestaDTO?.respuesta === "Sí"));

      const preguntasFormGroup = seccion.preguntas.map(this.buildPregunta);
  
      return this.fb.group({
        idSeccion: [seccion.idSeccion],
        titulo: [seccion.nombre],
        preguntas: this.fb.array(preguntasFormGroup)
      });
    });
  
    this.secciones = this.fb.array(formGroup) as FormArray;
    
    this.formularioGeneral = this.fb.group({
      secciones: this.secciones
    });    
  }

  private addValidatorsToRespuesta(agregarValidacion: boolean) {
    const secciones = this.formularioGeneral.get('secciones') as FormArray;
    this.formularioValido = agregarValidacion;
    secciones.controls.forEach(seccion => {
      const preguntas = seccion.get('preguntas') as FormArray;
      
      preguntas.controls.forEach(pregunta => {
        const respuestaControl = pregunta.get('respuesta');
        const alternativasControl = pregunta.get('alternativas').value as FormArray;
        const tipoPregunta = pregunta.get('tipoPregunta').value;
        if ((tipoPregunta === TipoPregunta.TEXTO)||(tipoPregunta === TipoPregunta.NUMERICO && alternativasControl.length === 0) || (tipoPregunta === TipoPregunta.RADIO) && respuestaControl) {
          respuestaControl.setValidators(agregarValidacion ? [Validators.required] : []);
          respuestaControl.updateValueAndValidity();
          if (!respuestaControl.valid) {
            this.formularioValido = false;
          }
        }

        const alternativas = pregunta.get('alternativas') as FormArray;
        alternativas.controls.forEach(alternativa => {
          const respuestaAlternativaControl = alternativa.get('respuesta');
          if (pregunta.get('tipoPregunta').value === TipoPregunta.NUMERICO && respuestaAlternativaControl) {
            respuestaAlternativaControl.setValidators(agregarValidacion ? [Validators.required] : []);
            respuestaAlternativaControl.updateValueAndValidity();
  
            if (!respuestaAlternativaControl.valid) {
              this.formularioValido = false;
            }
          }
        })
      });
  
      seccion.updateValueAndValidity();
    });
  
    this.formularioGeneral.updateValueAndValidity();
  }

  private buildRespuestaForm(respuesta: RespuestaDTO) {
    return !respuesta ? null : this.fb.group({
      idRespuesta: [respuesta.idRespuesta],
      idPregunta: [respuesta.idPregunta],
      idAlternativa: [respuesta.idAlternativa],
      idRegistroVMA: [respuesta.idRegistroVMA]
    })
  }


  private buildAlternativas(alternativa: Alternativa, tipoPregunta: TipoPregunta) {
    switch (tipoPregunta) {
      case TipoPregunta.NUMERICO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo],
          respuesta: [alternativa.respuestaDTO?.respuesta],
          respuestaDTO: this.buildRespuestaForm(alternativa.respuestaDTO)
        });
      case TipoPregunta.RADIO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo]
        });
        default:
        return null;
    }
  }

  seccionesForm(): FormArray {
    return this.formularioGeneral.get('secciones') as FormArray;
  }

  preguntasForm(seccion: AbstractControl): FormArray {
    return seccion.get('preguntas') as FormArray;
  }

  alternativasForm(pregunta: AbstractControl): FormArray {
    return pregunta.get('alternativas') as FormArray;
  }

  onRegresar(): void {
    this.router.navigate(['/inicio/vma']);
  }

  onCancelSave(){
    Swal.fire({
      title: "¿Está seguro que desea cancelar el registro?",
      text: "Si acepta no se guardará ninguna información.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2A3D",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "SI",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cancelado.",
          text: "No se ha registrado o actualizado.",
          icon: "error"
        });
        //this.backTo();
        this.router.navigate(['/inicio/vma']);
      }
    });
  }

  onBackToList(){
    this.router.navigate(['/inicio/vma']).then(() => {
      // es para forzar la recarga del listado por el momento.
     window.location.reload();
    });
  //  this.router.navigate(['/inicio/vma']);
    
  }
  
  onRadioButtonChange(seccion: AbstractControl, valor: string): void {
    const formArray = seccion.get('preguntas') as FormArray;
    if (valor === 'No' || !valor) {
      this.preguntasAuxiliar.forEach(pregunta => {
        const index = formArray.controls.findIndex(control => control.get('idPregunta').value === pregunta.idPregunta);
        
        if(index != -1) {
          formArray.removeAt(index);
        };
      })
      
    } else {
      this.preguntasAuxiliar.forEach(pregunta => {
        const preguntaFormGroup = this.buildPregunta(pregunta);
        formArray.push(preguntaFormGroup);
      });
    }
  }
}

enum FileType {
  XLS = "application/vnd.ms-excel",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PDF = "application/pdf"
}