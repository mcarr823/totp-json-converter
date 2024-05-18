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

    static parse(str: string){
        const json = JSON.parse(str) as IBitwardenJson;
        const items = json.items.map(data => {
            const { type, name, login } = data;
            const totp = login.totp;
            if (totp === null){
                throw new Error("TOTP cannot be null");
            }
            return new BitwardenToken({ type, name, totp })
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
        this.secret = data.totp;
        this.login = { totp: `otpauth://totp/${data.totp}` };
    }

}
