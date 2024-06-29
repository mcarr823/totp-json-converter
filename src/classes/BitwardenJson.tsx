import IBitwardenJson, { IItem } from "@/interfaces/IBitwardenJson";
import GenericJson from "./GenericJson";
import { IGenericJsonEntry } from "@/interfaces/IGenericJsonEntry";

export default class BitwardenJson{

    items: Array<BitwardenJsonItem>;

    constructor(
        json: IBitwardenJson
    ){

        const items = Array<BitwardenJsonItem>()
        json.items.forEach(item => {
            try{
                items.push(new BitwardenJsonItem(item))
            }catch(e){
                console.error(e)
            }
        })
        this.items = items

    }

}

class BitwardenJsonItem implements IGenericJsonEntry{

    type: string;
    name: string;
    issuer: string;
    secret: string;
    algo: string;
    digits: number;
    period: number;
    websites: Array<string>;

    constructor(
        data: IItem
    ){
        
        const { login } = data;
        if (typeof login === 'undefined')
            throw new Error("No login node - Not a valid 2FA token")

        const totp = login.totp;
        if (totp === null)
            throw new Error("TOTP cannot be null")
        
        const args = GenericJson.parseOtpAuthUri(totp);
        const { secret, digits, algo, period } = args
        const { issuer, name } = this.parseIssuer(data, args.issuer, args.name)

        this.type = "totp"
        this.name = name
        this.issuer = issuer
        this.secret = secret
        this.algo = algo
        this.digits = digits
        this.period = period
        this.websites = login.uris.map(u => u.uri)

    }

    parseIssuer(
        data: IItem,
        issuer: string,
        name: string
    ){

        var issuerArg, nameArg;
        if (issuer.length > 0 && name.length > 0){
            issuerArg = issuer;
            nameArg = name;
        }else if (issuer.length > 0){
            issuerArg = issuer;
            nameArg = data.name;
        }else{
            issuerArg = data.name;
            nameArg = '';
        }
        // TODO parse username?

        return {
            issuer: issuerArg,
            name: nameArg
        }

    }

}