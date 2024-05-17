import ITwoFAuthJson, { IToken } from "@/interfaces/ITwoFAuthJson";

export default class TwoFAuthJson{

    entries: Array<Token>;

    constructor(json: ITwoFAuthJson){
        this.entries = json.data.map(e => new Token(e));
    }

    static parse(str: string){
        const json = JSON.parse(str) as ITwoFAuthJson;
        return new TwoFAuthJson(json);
    }
    
}

class Token{
    otp_type: string; // totp, steamtotp
    account: string; //email
    service: string | null; //service name
    secret: string;
    digits: number; //usually 6 for totp, 5 for steamotp
    algorithm: string; //eg. sha1
    period: number;
    counter: null;
    legacy_uri: string; //eg. otpauth://totp/blahblah

    constructor(data: IToken){
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
}