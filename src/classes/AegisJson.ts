import IAegisJson, { Entry } from "@/interfaces/IAegisJson";

export default class AegisJson{

    entries: Array<Token>;

    constructor(str: string){
        const json = JSON.parse(str) as IAegisJson;
        this.entries = json.db.entries.map(e => new Token(e));
    }
}

class Token{

    "type": string; // "totp", "steam"
    "name": string; // service name
    "issuer": string;
    "secret": string;
    "algo": string; // eg. "SHA1"
    "digits": number; // 6 for totp, 5 for steam,
    "period": number; // usually 30

    constructor(data: Entry){
        this.type = data.type;
        this.name = data.name;
        this.issuer = data.issuer;
        this.secret = data.info.secret;
        this.algo = data.info.algo;
        this.digits = data.info.digits;
        this.period = data.info.period;
    }

}