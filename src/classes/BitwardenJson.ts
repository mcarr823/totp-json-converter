import IBitwardenJson, { IItem } from "@/interfaces/IBitwardenJson";
import { AegisToken } from "./AegisJson";
import { TwoFAuthToken } from "./TwoFAuthJson";

export default class BitwardenJson{

    entries: Array<BitwardenToken>;

    constructor(json: IBitwardenJson){
        this.entries = json.items.map(e => BitwardenToken.parse(e));
    }

    static parse(str: string){
        const json = JSON.parse(str) as IBitwardenJson;
        return new BitwardenJson(json);
    }

}

export class BitwardenToken{

    "type": number;
    "name": string;
    totp: string | null;

    constructor(data: {
        type: number,
        name: string,
        totp: string | null
    }){
        this.type = data.type;
        this.name = data.name;
        this.totp = data.totp;
    }

    static parse(data: IItem){
        return new BitwardenToken({
            type: data.type,
            name: data.name,
            totp: data.login.totp
        });
    }

    static parseAegis(data: AegisToken){
        return new BitwardenToken({
            type: 1, // 1 is "totp"?
            name: data.name,
            totp: data.secret //TODO convert to otpauth://totp/PayPal?secret=
        });
    }

    static parseTwoFAuth(data: TwoFAuthToken){
        if (data.service === null){
            throw new Error("Service cannot be null");
        }
        return new BitwardenToken({
            type: 1, // 1 is "totp"?
            name: data.service,
            totp: data.legacy_uri
        });
    }
}