// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    SERVER_IMG: `https://d13dxp8d6go1v2.cloudfront.net`,
    SERVER_GOOGLE_CACHE: `https://gapi.giasan.vn/dev/g-google-cache/v1`,
    // GET_ALL_THUA_DAT: `https://gapi.giasan.vn/dev-coccoc/v1/api/thua-dat/get-all-thua-dat`,
    GET_ALL_THUA_DAT: `https://api.rdvngroup.com/dev-coccoc/v1/api/thua-dat/get-all-thua-dat`,
    // GET_ONE_THUA_DAT: `https://gapi.giasan.vn/dev-coccoc/v1/api/thua-dat/get-thua-dat-by-id?thuaDatId=`,
    GET_ONE_THUA_DAT: `https://api.rdvngroup.com/dev-coccoc/v1/api/thua-dat/get-thua-dat-by-id?thuaDatId=`,
    // GET_ONE_THUA_DAT: `https://api.rdvngroup.com/dev-coccoc/v1/api/thua-dat/get-thua-dat-by-id?thuaDatId=`,
    UPDATE_MULTIPLE_THUA_DAT: `https://api.rdvngroup.com/dev-coccoc/v1/api/dia-chi/update-multiple-dia-chi`,
    AUTHENTICATION: `https://api.rdvngroup.com/dev-coccoc/v1/api/auth/login`,
    HTTP_GET_ADDRESS: `https://api.rdvngroup.com/dev-coccoc/v1/api/public/dia-chi`,
    HTTP_GET_ALL_CAN_BO: `https://api.rdvngroup.com/dev-coccoc/v1/api/public/get-can-bo-bo-sung-du-lieu`,
    HTTP_GET_STATIC_INFO: `https://api.rdvngroup.com/dev-coccoc/v1/api/public/get-trang-thai-thua-dat`,
    HTTP_THAY_DOI_TRANG_THAI_DIA_CHI: `https://api.rdvngroup.com/dev-coccoc/v1/api/dia-chi/thay-doi-trang-thai-dia-chi`
    // HTTP_GET_ADDRESS: `https://gapi.giasan.vn/dev-coccoc/v1/api/public/dia-chi`
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
