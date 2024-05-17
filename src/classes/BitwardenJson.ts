import IBitwardenJson, { IItem } from "@/interfaces/IBitwardenJson";

export default class BitwardenJson{

    entries: Array<Token>;

    constructor(json: IBitwardenJson){
        this.entries = json.items.map(e => new Token(e));
    }

    static parse(str: string){
        const json = JSON.parse(str) as IBitwardenJson;
        return new BitwardenJson(json);
    }

}

class Token{

    "type": number;
    "name": string;
    totp: string | null;

    constructor(data: IItem){
        this.type = data.type;
        this.name = data.name;
        this.totp = data.login.totp;
    }
}