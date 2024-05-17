import ITwoFAuthJson, { IToken } from "@/interfaces/ITwoFAuthJson";
import BitwardenJson, { BitwardenToken } from "./BitwardenJson";

export default class TwoFAuthJson{

    entries: Array<TwoFAuthToken>;

    constructor(json: ITwoFAuthJson){
        this.entries = json.data.map(e => TwoFAuthToken.parse(e));
    }

    static parse(str: string){
        const json = JSON.parse(str) as ITwoFAuthJson;
        return new TwoFAuthJson(json);
    }

    toBitwarden(){

        const result = new BitwardenJson({
            encrypted: false,
            folders: [],
            items: []
        });

        this.entries
            .map(BitwardenToken.parseTwoFAuth)
            .forEach(e => result.entries.push(e));

        return result;

    }
    
}

export class TwoFAuthToken{
    otp_type: string; // totp, steamtotp
    account: string; //email
    service: string | null; //service name
    secret: string;
    digits: number; //usually 6 for totp, 5 for steamotp
    algorithm: string; //eg. sha1
    period: number;
    counter: null;
    legacy_uri: string; //eg. otpauth://totp/blahblah

    constructor(data: {
        otp_type: string,
        account: string,
        service: string | null,
        secret: string,
        digits: number,
        algorithm: string,
        period: number,
        counter: null,
        legacy_uri: string
    }){
        this.otp_type = data.otp_type;
        this.account = data.account;
        this.service = data.service;
        this.secret = data.secret;
        this.digits = data.digits;
        this.algorithm = data.algorithm;
        this.period = data.period;
        this.counter = data.counter;
        this.legacy_uri = data.legacy_uri;
    }

    static parse(data: IToken){
        return new TwoFAuthToken({
            otp_type: data.otp_type,
            account: data.account,
            service: data.service,
            secret: data.secret,
            digits: data.digits,
            algorithm: data.algorithm,
            period: data.period,
            counter: data.counter,
            legacy_uri: data.legacy_uri
        });
    }
}