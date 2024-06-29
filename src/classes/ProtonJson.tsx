import { IGenericJsonEntry } from "@/interfaces/IGenericJsonEntry";
import GenericJson from "./GenericJson";

export default class ProtonJson{

    items: Array<ProtonJsonItem>;

    constructor(
        json: IProtonJson
    ){

        if (json.encrypted)
            throw new Error("Encrypted JSON not supported");
        
        const keys = Object.keys(json.vaults)
        const items = Array<ProtonJsonItem>()
    
        keys.flatMap(key => json.vaults[key].items)
            .flatMap(items => items.data)
            .filter(data => data.type === 'login')
            .forEach(item => {
                try{
                    items.push(new ProtonJsonItem(item))
                }catch(e){
                    console.error(e)
                }
            });
        this.items = items
    
    }

}

class ProtonJsonItem implements IGenericJsonEntry {

    type: string;
    name: string;
    issuer: string;
    secret: string;
    algo: string;
    digits: number;
    period: number;
    websites: Array<string>;

    constructor(data: ProtonData) {

        const totp = data.content.totpUri
        const { secret, digits, algo, period, issuer } = GenericJson.parseOtpAuthUri(totp);
        const issuerArg = issuer.length > 0 ? issuer : data.metadata.name
    
        this.type = "totp"
        this.name = data.content.username
        this.issuer = issuerArg
        this.secret = secret
        this.digits = digits
        this.algo = algo
        this.period = period
        this.websites = data.content.urls
    
    }

}
