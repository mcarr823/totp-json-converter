/**
 * Represents a minimal JSON object in the format expected by Bitwarden
 * when importing data. Based on:
 * https://bitwarden.com/help/condition-bitwarden-import/#minimum-required-key-value-pairs
 * 
 * eg.
 * {"items": [
 *     {
 *         "type": 1,
 *         "name": "My Service",
 *         "login": {
 *             "totp": "otpauth://totp/mysecret",
 *             "uris": [
 *                 "https://my.service.com"
 *             ]
 *         }
 *     }
 * ]}
 */

export default interface IBitwardenExport{
    items: Array<IBitwardenExportItem>;
}

export interface IBitwardenExportItem{
    type: number;
    name: string;
    login: IBitwardenExportItemLogin;
}

export interface IBitwardenExportItemLogin{
    totp: string;
    uris: Array<IBitwardenExportItemLoginUri>;
}

export interface IBitwardenExportItemLoginUri{
    match: null;
    uri: string;
}