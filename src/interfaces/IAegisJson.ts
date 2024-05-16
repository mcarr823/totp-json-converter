export default interface IAegisJson{
    "version": number;
    "header": Header;
    "db": Db;
}

interface Header{
    "slots": null;
    "params": null;
}

interface Db{
    "version": number;
    "entries": Array<Entry>;
}

export interface Entry{
    "type": string; // "totp", "steam"
    "uuid": string;
    "name": string; // service name
    "issuer": string;
    "note": string;
    "favorite": boolean;
    "icon": null;
    "info": Info;
    "groups": Array<string>; // this data type is probably wrong
}

interface Info{
    "secret": string;
    "algo": string; // eg. "SHA1"
    "digits": number; // 6 for totp, 5 for steam,
    "period": number; // usually 30
}