/**
 * {
    "app": "2fauth_v5.1.1",
    "schema": 1,
    "datetime": "2024-04-07T12:16:29.606564Z",
    "data": [
        {
            "otp_type": "totp",
            "account": "johndoe@facebook.com",
            "service": "Facebook",
            "icon": "82yCBkDNghIMJ0RfTkFHLPGFaEZSimAWPB4PMVhT.png",
            "icon_mime": "image\/png",
            "icon_file": "iVBORw0KGgoAAAA[...]RU5ErkJggg==",
            "secret": "A4GRFTVVRBGY7UIW",
            "digits": 6,
            "algorithm": "sha1",
            "period": 30,
            "counter": null,
            "legacy_uri": "otpauth:\/\/totp\/Facebook%3Ajohndoe%40facebook.com?issuer=Facebook&secret=A4GRFTVVRBGY7UIW"
        }
    ]
}
 */

export default interface ITwoFAuthExport{
    data: Array<ITwoFAuthExportItem>
}

export interface ITwoFAuthExportItem{
    "otp_type": string;
    "account": string;
    "service": string;
    "secret": string;
    "digits": number;
    "algorithm": string;
    "period": number;
    "counter": null;
    "legacy_uri": string;
}