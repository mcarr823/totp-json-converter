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