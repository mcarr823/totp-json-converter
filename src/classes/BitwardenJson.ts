import IBitwardenJson, { IItem } from "@/interfaces/IBitwardenJson";

class BitwardenJson{

    entries: Array<Token>;

    constructor(str: string){
        const json = JSON.parse(str) as IBitwardenJson;
        this.entries = json.items.map(e => new Token(e));
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