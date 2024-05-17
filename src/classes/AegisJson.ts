import IAegisJson, { IEntry } from "@/interfaces/IAegisJson";
import BitwardenJson, { BitwardenToken } from "./BitwardenJson";

export default class AegisJson{

    entries: Array<AegisToken>;

    constructor(json: IAegisJson){
        this.entries = json.db.entries.map(e => AegisToken.parse(e));
    }

    static parse(str: string){
        const json = JSON.parse(str) as IAegisJson;
        return new AegisJson(json);
    }

    toBitwarden(){

        const result = new BitwardenJson({
            encrypted: false,
            folders: [],
            items: []
        });

        this.entries
            .map(BitwardenToken.parseAegis)
            .forEach(e => result.entries.push(e));

        return result;

    }
    
}

export class AegisToken{

    "type": string; // "totp", "steam"
    "name": string; // service name
    "issuer": string;
    "secret": string;
    "algo": string; // eg. "SHA1"
    "digits": number; // 6 for totp, 5 for steam,
    "period": number; // usually 30

    constructor(data : {
        type: string,
        name: string,
        issuer: string,
        secret: string,
        algo: string,
        digits: number,
        period: number
    }){
        this.type = data.type;
        this.name = data.name;
        this.issuer = data.issuer;
        this.secret = data.secret;
        this.algo = data.algo;
        this.digits = data.digits;
        this.period = data.period;
    }

    static parse(data: IEntry){
        return new AegisToken({
            type: data.type,
            name: data.name,
            issuer: data.issuer,
            secret: data.info.secret,
            algo: data.info.algo,
            digits: data.info.digits,
            period: data.info.period,
        });
    }

}