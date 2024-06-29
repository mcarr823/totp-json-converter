import { FormatNames } from "@/enums/FormatNames";
import IAegisExport, { IAegisExportEntry } from "@/interfaces/IAegisExport";
import IBitwardenExport, { IBitwardenExportItem, IBitwardenExportItemLoginUri } from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport, { ITwoFAuthExportItem } from "@/interfaces/ITwoFAuthExport";
import IAegisJson from "@/interfaces/IAegisJson";
import IBitwardenJson from "@/interfaces/IBitwardenJson";
import { BitwardenType } from "@/enums/BitwardenType";
import { IGenericJsonTotpArgs } from "@/interfaces/IGenericJsonEntry";
import ITwoFAuthJson from "@/interfaces/ITwoFAuthJson";
import BitwardenJson from "./BitwardenJson";
import TwoFAuthJson from "./TwoFAuthJson";
import { GenericJsonEntry } from "./GenericJsonEntry";
import ProtonJson from "./ProtonJson";
import AegisJson from "./AegisJson";

export default class GenericJson{

    entries: Array<GenericJsonEntry>;

    constructor(str: string, format: string){
        if (format === FormatNames.AEGIS){
            this.entries = this.parseAegis(str);
        }else if (format === FormatNames.BITWARDEN){
            this.entries = this.parseBitwarden(str);
        }else if (format === FormatNames.TWOFAUTH){
            this.entries = this.parseTwoFAuth(str);
        }else if (format === FormatNames.PROTON){
            this.entries = this.parseProton(str);
        }else{
            throw new Error("Import failed");
        }
    }

    static substringAfterLast(str: string, char: string){
        const index = str.lastIndexOf(char);
        return str.substring(index+1);
    }

    static substringAfterFirst(str: string, char: string){
        const index = str.indexOf(char);
        return str.substring(index+1);
    }

    static parseOtpAuthUri(uri: string) : IGenericJsonTotpArgs{

        const totpPrefix = "otpauth://totp/"

        const digits = 6;
        const period = 30;
        const algo = "sha1";
        var name = '';
        var issuer = '';

        if (typeof uri === 'undefined' || uri.length <= totpPrefix.length){
            const secret = '';
            return { secret, digits, period, algo, issuer, name }
        }

        const urlWithoutPrefix = uri.substring(totpPrefix.length)

        // First, test for otpauth uris without any parameters.
        // eg. otpauth://totp/mysecret
        const qIndex = urlWithoutPrefix.indexOf('?')
        if (qIndex === -1){
            const secret = this.substringAfterLast(urlWithoutPrefix, '/')
            return { secret, digits, period, algo, issuer, name }
        }

        const nameAndIssuer = urlWithoutPrefix.substring(0, qIndex);
        const decodedNameAndIssuer = decodeURIComponent(nameAndIssuer);
        const cIndex = decodedNameAndIssuer.indexOf(':')
        if (cIndex !== -1){
            issuer = decodedNameAndIssuer.substring(0, cIndex)
            name = decodedNameAndIssuer.substring(cIndex+1)
        }else{
            issuer = decodedNameAndIssuer
        }

        // If the uri DOES have parameters, parse them as a
        // URLSearchParams object.
        // eg. otpauth://totp/Facebook:myusername?issuer=Facebook&secret=abc
        const querystring = this.substringAfterFirst(urlWithoutPrefix, '?');
        const params = new URLSearchParams(querystring);
        const digitParam = params.get('digits');
        const periodParam = params.get('period');
        return {
            secret: params.get('secret') ?? '',
            digits: digitParam !== null ? parseInt(digitParam) : digits,
            period: periodParam !== null ? parseInt(periodParam) : period,
            algo: params.get('algorithm') ?? algo,
            issuer: params.get('issuer') ?? issuer,
            name
        }

    }

    parseAegis(str: string){

        const json = JSON.parse(str) as IAegisJson;
        const obj = new AegisJson(json)
        const arr = Array<GenericJsonEntry>()
        obj.items.forEach(item => {
            try{
                arr.push(new GenericJsonEntry(item))
            }catch(e){
                console.error(e)
            }
        })
        return arr
        
    }

    parseBitwarden(str: string): Array<GenericJsonEntry>{
        
        const json = JSON.parse(str) as IBitwardenJson;
        const obj = new BitwardenJson(json)
        const arr = Array<GenericJsonEntry>()
        obj.items.forEach(item => {
            try{
                arr.push(new GenericJsonEntry(item))
            }catch(e){
                console.error(e)
            }
        })
        return arr

    }

    parseTwoFAuth(str: string){
        
        const json = JSON.parse(str) as ITwoFAuthJson;
        const obj = new TwoFAuthJson(json)
        const arr = Array<GenericJsonEntry>()
        obj.items.forEach(item => {
            try{
                arr.push(new GenericJsonEntry(item))
            }catch(e){
                console.error(e)
            }
        })
        return arr

    }

    parseProton(str: string){

        const json = JSON.parse(str) as IProtonJson;
        const obj = new ProtonJson(json)
        const arr = Array<GenericJsonEntry>()
        obj.items.forEach(item => {
            try{
                arr.push(new GenericJsonEntry(item))
            }catch(e){
                console.error(e)
            }
        })
        return arr

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
            if (data.type !== 'totp'){
                console.error("Bitwarden does not support this type of token");
                return
            }
            const type = BitwardenType.LOGIN;
            const login = {
                totp:data.buildOtpAuthUri(),
                uris:data.websites.map<IBitwardenExportItemLoginUri>(uri => {
                    return {
                        match:null,
                        uri:uri
                    };
                })
            };
            items.push({ type, name:data.issuer, login })
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

                return {
                    otp_type: data.type,
                    account: data.name,
                    service: data.issuer,
                    secret,
                    digits,
                    algorithm: data.algo,
                    period,
                    counter: null,
                    legacy_uri:data.buildOtpAuthUri()
                }
            })
        }
        return JSON.stringify(json);
    }

}
