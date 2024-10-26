import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {RegistroVmaRequest} from 'src/app/pages/vma/models/registroVMARequest';
import {RespuestaDTO} from 'src/app/pages/vma/models/respuestaRequest';
import {Alternativa} from 'src/app/pages/vma/models/alternativa';
import {Cuestionario} from 'src/app/pages/vma/models/cuestionario';
import {Pregunta} from 'src/app/pages/vma/models/pregunta';
import {TipoPregunta} from 'src/app/pages/vma/models/tipo-pregunta';
import {CuestionarioService} from 'src/app/_service/cuestionario.service';
import {VmaService} from 'src/app/pages/vma/services/vma.service';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, Observable, of, Subscription} from 'rxjs';
import {SessionService} from 'src/app/_service/session.service';
import {UploadService} from 'src/app/_service/upload.service';
import {finalize, switchMap, tap} from "rxjs/operators";
import { RADIO_BUTTON_NO,ESTADO_COMPLETO, ROL_REGISTRADOR } from 'src/app/utils/var.constant';

@Component({
  selector: 'app-registrar-vma',
  templateUrl: './registrar-vma.component.html',
  styleUrls: ['./registrar-vma.component.css'],
  providers: [MessageService]
})


export class RegistrarVmaComponent implements OnInit, OnDestroy {
  cuestionario: Cuestionario;
  registroForm: FormGroup;
  registroCompleto: boolean = false; //cambiar por statusRegistroVMA


  formularioGeneral: FormGroup;
  idRegistroVMA: number = null;
  formularioValido: boolean = false;
  seccionActiva: number; // Variable para almacenar el índice de la sección activa

  isGreenTab = true; // para cambiar al color verde en el tab

  isRoleRegistrador: boolean = this.sessionService.obtenerRoleJwt().toUpperCase() === ROL_REGISTRADOR;
  formGroupPregunta: FormGroup;
  secciones: FormArray;
  preguntasAuxiliar: Pregunta[] = [];
  cargandoProceso$: Observable<boolean>;
  suscripcionRegistro: Subscription;
  isRegistroCompleto: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cuestionarioService: CuestionarioService,
    private vmaService: VmaService,
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    public uploadService: UploadService
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

  this.activatedRoute.params.subscribe(params => {
    this.idRegistroVMA = params['id'];

    if(this.idRegistroVMA) {
      this.vmaService.findById(this.idRegistroVMA)
        .pipe(
          tap((response: any) => this.isRegistroCompleto = response.estado === ESTADO_COMPLETO),
          switchMap(() => this.cuestionarioService.cuestionarioConRespuestas(this.idRegistroVMA)),
          tap((response: any) => {
            this.cuestionario = response.item;
            this.buildForm();
          })
        )
        .subscribe();
    } else {
      this.cuestionarioService.findCuestionarioByIdMax().subscribe((response: any) => {
        this.cuestionario = response.item;
        this.buildForm();
      })
    }
  })

  //this.vmaService.isRegistroCompleto().subscribe(response => this.registroCompleto = response);
  //this.vmaService.registroCompleto$.subscribe(response => this.registroCompleto = response);

  }

  isFile(value: any): boolean {
 
    return value instanceof File;
  }

  guardar(isGuardadoCompleto: boolean){
    this.cargandoProceso$ = of(true);
    const preguntasArray = this.formularioGeneral.value.secciones.map(seccion => seccion.preguntas);
    let preguntas: Pregunta[] = preguntasArray.reduce((acc, cur) => acc.concat(cur), []);
    const respuestas: RespuestaDTO[] = [];
    const respuestasArchivo: RespuestaDTO[] = [];
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
      } else if(pregunta.tipoPregunta === TipoPregunta.ARCHIVO) {
        if(this.isFile(pregunta.respuesta)) {
          respuestasArchivo.push({
            idRespuesta: pregunta.respuestaDTO?.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idRegistroVMA: null,
            respuesta: pregunta.respuesta,
            idAlternativa: null
          });
        }
      }else {
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

    if(this.idRegistroVMA) {

      this.suscripcionRegistro = this.vmaService.updateRegistroVMA(this.idRegistroVMA, registroVMA)
        .pipe(
          switchMap(registroVMAId => {
            if(respuestasArchivo.length > 0) {
              return forkJoin(
                respuestasArchivo.map(respuesta => this.uploadService.uploadFile(respuesta.respuesta, registroVMAId, respuesta.idPregunta, respuesta.idRespuesta))
              )
            }

            return of(null);
          }),
          finalize(() => this.cargandoProceso$ = of(false))
        ).subscribe(
            () => {
              console.log("metodo guardar -");
              this.router.navigate(['/inicio/vma']);
              Swal.fire({
                title: isGuardadoCompleto ? 'Registro completado': 'Se ha realizado el guardado Progresivo',  // Registro actualizado
                icon: 'success',
                confirmButtonText: 'Aceptar',
                //allowOutsideClick: false  //evita hacer click fuera del alert
              }).then((result) => {
              
              });
            }
          );
    } else {

      this.suscripcionRegistro = this.vmaService.saveRegistroVMA(registroVMA)
        .pipe(
          switchMap(registroVMAId => {
            if(respuestasArchivo.length > 0) {
              return forkJoin(
                respuestasArchivo.map(respuesta => this.uploadService.uploadFile(respuesta.respuesta, registroVMAId, respuesta.idPregunta, respuesta.idRespuesta))
              )
            }
            return of(null);
          })
        )
        .subscribe(
        () => {
          this.onSuccess(isGuardadoCompleto);
        }
      );
    }
  }

  onSuccess(isGuardadoCompleto: boolean) {
    console.log("metodo onsuccess -");
    Swal.fire({
      title: isGuardadoCompleto ? 'Registro completado': 'Se ha realizado el guardado Progresivo',   //'Registro actualizado'
      // text:  isGuardadoCompleto? 'Su información ha sido registrada y enviada.' : 'Registrado guardado parcialmente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false    //evita hacer click fuera del alert
    });
   
    this.router.navigate(['/inicio/vma']);
    this.vmaService.sendRegistroCompleto(true);
  }

  onCancelFile(formControl: AbstractControl, pregunta: Pregunta): void {
    formControl.setValue(!!pregunta.respuestaDTO ? pregunta.respuestaDTO.respuesta : null);
    formControl.setValidators(this.agregarValidadorARespuesta(pregunta));
    formControl.updateValueAndValidity();
    formControl.markAsPristine();
  }

  onFileChange(event: any, formControl: AbstractControl): void {
    const file = event.files[0];
    if (file) {
      
      formControl.patchValue(file);
    }
  }

  onUpdateFile(formControl: AbstractControl): void {

    let metadato = formControl.get('metadato').value;
    let validatorFn = this.fileValidator(metadato.tipoArchivosPermitidos.map(archivo => archivo.mimeType), metadato.maxSizeInMB);
    formControl.get('respuesta').setValue(null);
    formControl.get('respuesta').setValidators(validatorFn);
    formControl.updateValueAndValidity();
  }

  private fileValidator(allowedTypes: string[], numberMB: number): ValidatorFn {
    return (control: FormControl) => {
      const file = control.value;
      if (file) {
        if (!allowedTypes.includes(file.type)) {
          return { fileType: true };
        }

        const maxSize = numberMB * 1024 * 1024;
        if (file.size > maxSize) {
          return { maxSize: true };
        }
      }
      return null;
    };
  }

  guardadoCompleto(): void {
    this.addValidatorsToRespuesta(true);
    if(this.formularioValido) {
      this.guardar(true);
    } else {
      this.formularioGeneral.markAllAsTouched();
      Swal.fire('Registrado final','Para registrar todo debe completar el formulario.','info')
    }
  }

  guardadoParcial(): void {
    this.addValidatorsToRespuesta(false);
    this.guardar(false);
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
      respuesta: [pregunta.respuestaDTO?.respuesta, this.agregarValidadorARespuesta(pregunta)],
      respuestaDTO: this.buildRespuestaForm(pregunta.respuestaDTO),
      metadato: [pregunta.metadato]
    });

    if(pregunta.tipoPregunta === 'RADIO') {
      this.formGroupPregunta = preguntaFormGroup;
    }

    if (!this.isRoleRegistrador || this.isRegistroCompleto) {
      preguntaFormGroup.disable();
    }

    return preguntaFormGroup;
  }

  buildForm() {
    const formGroup = this.cuestionario.secciones.map(seccion => {
      const preguntasDependientes = seccion.preguntas.filter(pregunta => !!pregunta.preguntaDependiente);
      if(preguntasDependientes.length > 0) {
        this.preguntasAuxiliar = preguntasDependientes;
      }

      //seccion.preguntas = seccion.preguntas.filter(pregunta => !pregunta.preguntaDependiente || (pregunta.preguntaDependiente && pregunta.preguntaDependiente.respuestaDTO?.respuesta === "Sí"));
      seccion.preguntas = seccion.preguntas.filter(pregunta => !pregunta.preguntaDependiente || (pregunta.preguntaDependiente && pregunta.preguntaDependiente.respuestaDTO?.respuesta === "SI"));
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
        if ((tipoPregunta === TipoPregunta.TEXTO)||
          (tipoPregunta === TipoPregunta.NUMERICO && alternativasControl.length === 0) ||
          (tipoPregunta === TipoPregunta.RADIO) && respuestaControl ||(tipoPregunta === TipoPregunta.ARCHIVO && pregunta.get('metadato').value.requerido)) {
//|| pregunta.get('alternativas').get('requerido')
          if(agregarValidacion) {
            respuestaControl.addValidators([Validators.required])
          } else {
            respuestaControl.setValidators([]);
          }

          respuestaControl.updateValueAndValidity();
          if (!respuestaControl.valid) {
            this.formularioValido = false;
          }
        }

        const alternativas = pregunta.get('alternativas') as FormArray;
        alternativas.controls.forEach(alternativa => {
          const respuestaAlternativaControl = alternativa.get('respuesta');
          if (pregunta.get('tipoPregunta').value === TipoPregunta.NUMERICO && respuestaAlternativaControl) {
            respuestaAlternativaControl.setValidators(agregarValidacion && alternativa.get('requerido').value ? [Validators.required] : []);
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
      idRegistroVMA: [respuesta.idRegistroVMA],
      respuesta: [respuesta.respuesta]
    })
  }

  private buildAlternativas(alternativa: Alternativa, tipoPregunta: TipoPregunta) {
    switch (tipoPregunta) {
      case TipoPregunta.NUMERICO:
        return this.fb.group({
          idAlternativa: [alternativa.idAlternativa],
          nombreCampo: [alternativa.nombreCampo],
          respuesta: [alternativa.respuestaDTO?.respuesta],
          requerido: [alternativa.requerido],
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

  private agregarValidadorARespuesta (pregunta: Pregunta): ValidatorFn | null {
    if(!!pregunta.metadato && !pregunta.respuestaDTO && pregunta.tipoPregunta === TipoPregunta.ARCHIVO) {
      return this.fileValidator(pregunta.metadato.tipoArchivosPermitidos.map(archivo => archivo.mimeType), pregunta.metadato.maxSizeInMB);
    }
    return null
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
      cancelButtonText: "NO",
      allowOutsideClick: false, // Evita que se cierre al hacer clic fuera
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
    if (valor === RADIO_BUTTON_NO || !valor) {
      this.preguntasAuxiliar.forEach(pregunta => {
        const index = formArray.controls.findIndex(control => control.get('idPregunta').value === pregunta.idPregunta);

        if(index != -1) {
          formArray.removeAt(index);
        }
      })

    } else {
      this.preguntasAuxiliar.forEach(pregunta => {
        const index = formArray.controls.findIndex(control => control.get('idPregunta').value === pregunta.idPregunta);
        if(index === -1) {
          const preguntaFormGroup = this.buildPregunta(pregunta);
          formArray.push(preguntaFormGroup);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if(this.suscripcionRegistro) {
      this.suscripcionRegistro.unsubscribe();
    }
  }
}

enum FileType {
  XLS = "XLS",
  XLSX = "XLSX",
  DOC = "DOC",
  DOCX = "DOCX",
  PDF = "PDF"
}

interface ArchivoTipo {
  nombre: string;
  mimeType: string;
}