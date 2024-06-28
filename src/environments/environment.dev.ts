export const environment = {
    production: false,
    HOST : "https://apidev.sunass.gob.pe/api-vma",
    TOKEN_NAME : 'access_token',
    ALLOWED_DOMAINS : ['apidev.sunass.gob.pe'],// ALLOWED_DOMAINS : ['apidev.sunass.gob.pe','10.10.3.94'],
    DISALLOWED_ROUTES: ['https://apidev.sunass.gob.pe/api-vma/auth/authenticate'] //'http://10.10.3.94/api-vma/auth/authenticate'
};