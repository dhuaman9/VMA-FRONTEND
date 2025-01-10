//tipos de datos:
export const BOOLEAN = 'boolean';


// sobre Empresas:
export const REGIMEN_RAT = 'RAT';
export const REGIMEN_NO_RAT = 'NO RAT';
export const  TIPO_SUNASS='SUNASS';
export const  TIPO_EPS='EPS';
export const  TIPO_EPS_PEQUEÑA='PEQUEÑA';
export const  TIPO_EPS_MEDIANA='MEDIANA';
export const  TIPO_EPS_GRANDE='GRANDE';
export const  TIPO_EPS_SEDAPAL='SEDAPAL';

//roles de usuarios
export const ROL_ADMINISTRADOR_OTI='ADMINISTRADOR OTI';
//export const ROL_ADMINISTRADOR_DAP='ADMINISTRADOR DAP';
export const ROL_ADMINISTRADOR_DF='ADMINISTRADOR DF';
export const ROL_REGISTRADOR='REGISTRADOR';
export const ROL_CONSULTOR='CONSULTOR';

//estados de registros VMA:
export const ESTADO_COMPLETO='COMPLETO';
export const ESTADO_INCOMPLETO='INCOMPLETO';
export const ESTADO_SIN_REGISTRO='SIN REGISTRO';
export const ANIO_APERTURA_VMA=2024;

//elementos HTML
export const RADIO_BUTTON_SI="SI";
export const RADIO_BUTTON_NO="NO";

//mensajes de login
export const INP_USUARIO="Ingrese su usuario";
export const INP_CONTRASENIA="Ingrese su contraseña";
export const MSG_USUARIO_PASS_ERROR="Usuario y/o contraseña incorrectos";


//EXPRESIONES REGULARES

/*exp para password: Entre 8 a 15 caracteres, no espacios, al menos una mayúscula,
 una minúscula, un número y un caracter especial (@$!%*?&.,#-_;)*/
export const PASSWORD_REGEX= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.,#-_;])([A-Za-z\d$@$!%*?&.,#-_;]|[^ ]){8,15}$/;
export const NUMBER_REGEX= /\B(?=(\d{3})+(?!\d))/g;

//FORMATOS

export const FORMATO_FECHA= "DD/MM/YYYY"  //Orden: Día - Mes - Año. 




