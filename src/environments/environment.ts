// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST : "http://localhost:8085/vma",
  TOKEN_NAME : 'access_token',
  ALLOWED_DOMAINS : ['localhost:8085'],
  DISALLOWED_ROUTES: ['http://localhost:8085/vma/auth/authenticate']
};

/*export const environment = {
  production: false,
  HOST : "https://apidev.sunass.gob.pe/api-vma",
  TOKEN_NAME : 'access_token',
  ALLOWED_DOMAINS : ['apidev.sunass.gob.pe'],
  DISALLOWED_ROUTES: ['https://apidev.sunass.gob.pe/api-vma/auth/authenticate']
};*/

