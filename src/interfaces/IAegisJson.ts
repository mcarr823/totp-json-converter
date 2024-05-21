export default interface IAegisJson{
    version: number;
    header: IHeader;
    db: IDb;
}

interface IHeader{
    slots: null;
    params: null;
}

interface IDb{
    version: number;
    entries: Array<IEntry>;
}

export interface IEntry{
    type: string; // "totp", "steam"
    uuid: string;
    name: string; // service name
    issuer: string;
    note: string;
    favorite: boolean;
    icon: null;
    info: IInfo;
    groups: Array<string>; // this data type is probably wrong
}

interface IInfo{
    secret: string;
    algo: string; // eg. "SHA1"
    digits: number; // 6 for totp, 5 for steam,
    period: number; // usually 30
}