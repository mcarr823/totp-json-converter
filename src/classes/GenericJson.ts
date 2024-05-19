import BitwardenJson from "./BitwardenJson";
import AegisJson from "./AegisJson";
import TwoFAuthJson from "./TwoFAuthJson";
import { FormatNames } from "@/enums/FormatNames";
import IAegisExport, { IAegisExportEntry } from "@/interfaces/IAegisExport";
import IBitwardenExport, { IBitwardenExportItem } from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport, { ITwoFAuthExportItem } from "@/interfaces/ITwoFAuthExport";

export default class GenericJson{

    entries: Array<GenericJsonEntry>;

    constructor(str: string, format: string){
        if (format === FormatNames.AEGIS){
            this.entries = this.parseAegis(str);
        }else if (format === FormatNames.BITWARDEN){
            this.entries = this.parseBitwarden(str);
        }else if (format === FormatNames.TWOFAUTH){
            this.entries = this.parseTwoFAuth(str);
        }else{
            throw new Error("Import failed");
        }
    }

    parseAegis(str: string){
        const json = JSON.parse(str) as AegisJson;
        return json.db.entries.map<GenericJsonEntry>(data => {
            const { type, name, issuer, info } = data;
            const {secret, algo, digits, period } = info;
            return { type, name, issuer, secret, algo, digits, period }
        });
    }

    parseBitwarden(str: string){
        const json = JSON.parse(str) as BitwardenJson;
        return json.items.map<GenericJsonEntry>(data => {
            return {
                type: "totp",
                name: '', // TODO username?
                issuer: data.name,
                secret: data.secret,
                digits: 6,
                algo: "sha1",
                period: 30,
            }
        });
    }

    parseTwoFAuth(str: string){
        const json = JSON.parse(str) as TwoFAuthJson;
        return json.data.map<GenericJsonEntry>(data => {
            return {
                type: data.otp_type,
                name: data.account,
                issuer: data.service,
                secret: data.secret,
                digits: data.digits,
                algo: data.algorithm,
                period: data.period
            }
        });
    }

    export(format: string): string{
        if (format === FormatNames.AEGIS){
            return this.exportAegis();
        }else if (format === FormatNames.BITWARDEN){
            return this.exportBitwarden();
        }else if (format === FormatNames.TWOFAUTH){
            return this.exportTwoFAuth();
        }else{
            throw new Error("Export failed");
        }
    }

    exportAegis(): string{
        const json: IAegisExport = {
            db: {
                entries: this.entries.map<IAegisExportEntry>(data => {
                    return {
                        type: data.type,
                        name: data.name,
                        issuer: data.issuer,
                        info: {
                            secret: data.secret,
                            digits: data.digits,
                            algo: data.algo,
                            period: data.period,
                        }
                    }
                })
            }
        }
        return JSON.stringify(json);
    }

    exportBitwarden(): string{
        const json: IBitwardenExport = {
            items: this.entries.map<IBitwardenExportItem>(data => {
                const { name, secret } = data;
                const type = BitwardenJson.parseType(data.type);
                const login = { totp:`otpauth://totp/${secret}` };
                return { type, name, login }
            })
        }
        return JSON.stringify(json);
    }

    exportTwoFAuth(): string{
        const json: ITwoFAuthExport = {
            data: this.entries.map<ITwoFAuthExportItem>(data => {
                return {
                    "otp_type": data.type,
                    "account": data.name,
                    "service": data.issuer,
                    "secret": data.secret,
                    "digits": data.digits,
                    "algorithm": data.algo,
                    "period": data.period,
                    "counter": null,
                    "legacy_uri": `otpauth://totp/${data.secret}`
                }
            })
        }
        return JSON.stringify(json);
    }

}

class GenericJsonEntry{

    "type": string; // "totp", "steam"
    "name": string; // service name
    "issuer": string;
    "secret": string;
    "algo": string; // eg. "SHA1"
    "digits": number; // 6 for totp, 5 for steam,
    "period": number; // usually 30

}