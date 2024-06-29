import IAegisJson, { IEntry } from "@/interfaces/IAegisJson";
import { IGenericJsonEntry } from "@/interfaces/IGenericJsonEntry";

export default function AegisJson(
    json: IAegisJson
){

    return json.db.entries.map(data => new AegisJsonItem(data))

}

class AegisJsonItem implements IGenericJsonEntry {

    type: string;
    name: string;
    issuer: string;
    secret: string;
    algo: string;
    digits: number;
    period: number;
    websites: Array<string>;

    constructor(data: IEntry){
        
        const { type, name, issuer, info } = data;
        const {secret, algo, digits, period } = info;

        this.type = type
        this.name = name
        this.issuer = issuer
        this.secret = secret
        this.algo = algo
        this.digits = digits
        this.period = period
        this.websites = []

    }

}