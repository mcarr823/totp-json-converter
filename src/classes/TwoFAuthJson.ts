import ITwoFAuthJson, { IToken } from "@/interfaces/ITwoFAuthJson";
import BitwardenJson from "./BitwardenJson";
import ITwoFAuthExport, { ITwoFAuthExportItem } from "@/interfaces/ITwoFAuthExport";
import AegisJson from "./AegisJson";

export default class TwoFAuthJson implements ITwoFAuthExport {

    data: Array<ITwoFAuthExportItem>;

    constructor(data: Array<ITwoFAuthExportItem>){
        this.data = data;
    }

    export() {
        return JSON.stringify(this);
    }

    static parse(str: string){
        const json = JSON.parse(str) as ITwoFAuthJson;
        const data = json.data.map(TwoFAuthToken.parse);
        return new TwoFAuthJson(data);
    }

    static parseAegis(json: AegisJson){
        const items = json.db.entries.map(data => new TwoFAuthToken({
            otp_type: "totp",
            account: data.name,
            service: data.issuer,
            secret: data.info.secret,
            digits: data.info.digits,
            algorithm: data.info.algo,
            period: data.info.period,
            counter: null,
            legacy_uri: `otpauth://totp/${data.info.secret}`
        }));
        return new TwoFAuthJson(items);
    }

    static parseBitwarden(json: BitwardenJson){
        const items = json.items.map(data => new TwoFAuthToken({
            otp_type: "totp", // Bitwarden tokens are totp-only at the moment
            account: '', // TODO username?
            service: data.name,
            secret: '',
            digits: 6,
            algorithm: "sha1",
            period: 30,
            counter: null,
            legacy_uri: data.login.totp
        }));
        return new TwoFAuthJson(items);
    }
    
}

export class TwoFAuthToken implements ITwoFAuthExportItem{

    otp_type: string; // totp, steamtotp
    account: string; //email
    service: string; //service name
    secret: string;
    digits: number; //usually 6 for totp, 5 for steamotp
    algorithm: string; //eg. sha1
    period: number;
    counter: null;
    legacy_uri: string; //eg. otpauth://totp/blahblah

    constructor(data: ITwoFAuthExportItem){
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
        const {
            otp_type,
            account,
            secret,
            digits,
            algorithm,
            period,
            counter,
            legacy_uri
        } = data;
        return new TwoFAuthToken({
            otp_type,
            account,
            service: data.service ?? '',
            secret,
            digits,
            algorithm,
            period,
            counter,
            legacy_uri
        })
    }

}