import { FormatNames } from "@/enums/FormatNames";
import IAegisExport, { IAegisExportEntry } from "@/interfaces/IAegisExport";
import IBitwardenExport, { IBitwardenExportItem } from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport, { ITwoFAuthExportItem } from "@/interfaces/ITwoFAuthExport";
import IAegisJson from "@/interfaces/IAegisJson";
import IBitwardenJson from "@/interfaces/IBitwardenJson";
import { BitwardenType } from "@/enums/BitwardenType";

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
        const json = JSON.parse(str) as IAegisJson;
        return json.db.entries.map<GenericJsonEntry>(data => {
            const { type, name, issuer, info } = data;
            const {secret, algo, digits, period } = info;
            return { type, name, issuer, secret, algo, digits, period }
        });
    }

    parseBitwarden(str: string){
        const json = JSON.parse(str) as IBitwardenJson;
        const items = Array<GenericJsonEntry>();
        json.items.forEach(data => {
            const { name, login } = data;
            if (typeof login === 'undefined'){
                console.error("No login node - Not a valid 2FA token");
                return;
            }
            const totp = login.totp;
            if (totp === null){
                console.error("TOTP cannot be null");
                return;
            }
            const index = totp.lastIndexOf('/');
            const secret = totp.substring(index+1);

            items.push({
                type: "totp",
                name: '', // TODO username?
                issuer: name,
                secret,
                digits: 6,
                algo: "sha1",
                period: 30,
            })
        });
        return items
    }

    parseTwoFAuth(str: string){
        const json = JSON.parse(str) as ITwoFAuthExport;
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
        const items = Array<IBitwardenExportItem>()
        this.entries.forEach(data => {
            const { issuer, secret } = data;
            if (data.type !== 'totp'){
                console.error("Bitwarden does not support this type of token");
                return
            }
            const type = BitwardenType.LOGIN;
            const login = { totp:`otpauth://totp/${secret}` };
            items.push({ type, name:issuer, login })
        })
        const json: IBitwardenExport = {
            items
        }
        return JSON.stringify(json);
    }

    exportTwoFAuth(): string{
        const json: ITwoFAuthExport = {
            data: this.entries.map<ITwoFAuthExportItem>(data => {

                const { secret, digits, period } = data;
                
                const name = [];
                const encodedIssuer = encodeURIComponent(data.issuer);
                if (data.issuer.length > 0) name.push(encodedIssuer);
                if (data.name.length > 0) name.push(encodeURIComponent(data.name));

                var legacy_uri = 'otpauth://totp/';
                if (name.length > 0){
                    // %3A = ":" encoded
                    legacy_uri += name.join('%3A')+`?issuer=${encodedIssuer}&secret=${data.secret}`;
                }else{
                    legacy_uri += data.secret;
                }

                return {
                    otp_type: data.type,
                    account: data.name,
                    service: data.issuer,
                    secret,
                    digits,
                    algorithm: data.algo,
                    period,
                    counter: null,
                    legacy_uri
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