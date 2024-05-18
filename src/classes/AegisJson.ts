import IAegisJson from "@/interfaces/IAegisJson";
import BitwardenJson from "./BitwardenJson";
import IAegisExport, { IAegisExportEntry } from "@/interfaces/IAegisExport";
import TwoFAuthJson from "./TwoFAuthJson";

export default class AegisJson implements IAegisExport{

    db: {
        entries: Array<IAegisExportEntry>;
    };

    constructor(entries: Array<IAegisExportEntry>){
        this.db = { entries };
    }

    export(){
        return JSON.stringify(this);
    }

    static parse(str: string){
        const json = JSON.parse(str) as IAegisJson;
        const entries = json.db.entries.map<IAegisExportEntry>(data => {
            const { type, name, issuer, info } = data;
            return { type, name, issuer, info }
        });
        return new AegisJson(entries);
    }

    static parseBitwarden(json: BitwardenJson){
        const items = json.items.map<IAegisExportEntry>(data => {
            return {
                type: "totp",
                name: '', // TODO username?
                issuer: data.name,
                info: {
                    secret: data.secret,
                    digits: 6,
                    algo: "sha1",
                    period: 30,
                }
            }
        });
        return new AegisJson(items);
    }

    static parseTwoFAuth(json: TwoFAuthJson){
        const items = json.data.map<IAegisExportEntry>(data => {
            return {
                type: data.otp_type,
                name: data.account,
                issuer: data.service,
                info: {
                    secret: data.secret,
                    digits: data.digits,
                    algo: data.algorithm,
                    period: data.period,
                }
            }
        });
        return new AegisJson(items);
    }
    
}
