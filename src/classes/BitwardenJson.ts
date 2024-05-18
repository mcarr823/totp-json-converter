import IBitwardenJson from "@/interfaces/IBitwardenJson";
import AegisJson from "./AegisJson";
import TwoFAuthJson from "./TwoFAuthJson";
import { BitwardenType } from "@/enums/BitwardenType";
import IBitwardenExport, { IBitwardenExportItem, IBitwardenExportItemLogin } from "@/interfaces/IBitwardenExport";

export default class BitwardenJson implements IBitwardenExport{

    items: Array<BitwardenToken>;

    constructor(items: Array<BitwardenToken>){
        this.items = items;
    }

    export(): string {
        return JSON.stringify(this);
    }

    static parse(str: string) {
        const json = JSON.parse(str) as IBitwardenJson;
        const items = Array<BitwardenToken>();
        json.items.forEach(data => {
            const { type, name, login } = data;
            if (typeof login === 'undefined'){
                console.error("No login node - Not a valid 2FA token");
                return;
            }
            const totp = login.totp;
            if (totp === null){
                console.error("TOTP cannot be null");
                return;
            }
            const token = new BitwardenToken({ type, name, totp })
            items.push(token);
        });
        return new BitwardenJson(items);
    }

    static parseAegis(json: AegisJson){
        const items = json.db.entries.map(data => new BitwardenToken({
            type:BitwardenType.LOGIN,
            name:data.name,
            totp:data.info.secret
        }));
        return new BitwardenJson(items);
    }

    static parseTwoFAuth(json: TwoFAuthJson){
        const items = json.data.map(data => new BitwardenToken({
            type:BitwardenType.LOGIN,
            name:data.service,
            totp:data.secret
        }));
        return new BitwardenJson(items);
    }

}

class BitwardenToken implements IBitwardenExportItem{

    type: number;
    name: string;
    secret: string; // Needed for conversions, not for export
    login: IBitwardenExportItemLogin;

    constructor(data : { type: number, name: string, totp: string }){
        this.type = data.type;
        this.name = data.name;
        this.login = { totp: data.totp };

        // TODO: also add support for otpauth urls with ?secret= format
        const index = data.totp.lastIndexOf('/');
        this.secret = data.totp.substring(index+1);
    }

}
