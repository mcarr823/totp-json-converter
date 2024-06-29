import { IGenericJsonEntry } from "@/interfaces/IGenericJsonEntry";
import ITwoFAuthJson, { IToken } from "@/interfaces/ITwoFAuthJson";
import GenericJson from "./GenericJson";

export default function TwoFAuthJson(
    json: ITwoFAuthJson
){
    
    const items = Array<TwoFAuthJsonItem>()
    json.data.forEach(item => {
        try{
            items.push(new TwoFAuthJsonItem(item))
        }catch(e){
            console.error(e)
        }
    });
    return items

}

class TwoFAuthJsonItem implements IGenericJsonEntry{

    type: string;
    name: string;
    issuer: string;
    secret: string;
    algo: string;
    digits: number;
    period: number;
    websites: Array<string>;

    constructor(
        data: IToken
    ){
        
        const { secret, digits, algorithm: algo, period, otp_type: type } = data
        const parsedArgs = GenericJson.parseOtpAuthUri(data.legacy_uri);
        const { issuer, name } = this.parseIssuer(data, parsedArgs.issuer, parsedArgs.name)

        this.type = type
        this.name = name
        this.issuer = issuer
        this.secret = secret
        this.algo = algo
        this.digits = digits
        this.period = period
        this.websites = []

    }

    parseIssuer(
        data: IToken,
        issuer: string,
        name: string
    ){
        var issuerArg, nameArg;
        if (issuer.length > 0 && name.length > 0){
            issuerArg = issuer;
            nameArg = name;
        }else if (issuer.length > 0){
            issuerArg = issuer;
            nameArg = data.account;
        }else if (data.service !== null){
            issuerArg = data.service;
            nameArg = data.account;
        }else{
            issuerArg = data.account;
            nameArg = '';
        }
        return {
            issuer: issuerArg,
            name: nameArg
        }
    }

}