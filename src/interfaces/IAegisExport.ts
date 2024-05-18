export default interface IAegisExport{
    "db": {
        "entries": Array<IAegisExportEntry>;
    }
}

export interface IAegisExportEntry{
    "type": string; // "totp", "steam"
    "name": string; // service name
    "issuer": string;
    "info": IAegisExportEntryInfo;
}

interface IAegisExportEntryInfo{
    "secret": string;
    "algo": string; // eg. "SHA1"
    "digits": number; // 6 for totp, 5 for steam,
    "period": number; // usually 30
}