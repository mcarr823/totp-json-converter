import { FormatNames } from "@/enums/FormatNames";
import IAegisExport, { IAegisExportEntry } from "@/interfaces/IAegisExport";
import IBitwardenExport, { IBitwardenExportItem, IBitwardenExportItemLoginUri } from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport, { ITwoFAuthExportItem } from "@/interfaces/ITwoFAuthExport";
import IAegisJson from "@/interfaces/IAegisJson";
import IBitwardenJson from "@/interfaces/IBitwardenJson";
import { BitwardenType } from "@/enums/BitwardenType";
import { IGenericJsonTotpArgs } from "@/interfaces/IGenericJsonEntry";

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

    substringAfterLast(str: string, char: string){
        const index = str.lastIndexOf(char);
        return str.substring(index+1);
    }

    substringAfterFirst(str: string, char: string){
        const index = str.indexOf(char);
        return str.substring(index+1);
    }

    parseOtpAuthUri(uri: string) : IGenericJsonTotpArgs{

        const digits = 6;
        const period = 30;
        const algo = "sha1";
        const issuer = '';

        // First, test for otpauth uris without any parameters.
        // eg. otpauth://totp/mysecret
        const qIndex = uri.indexOf('?')
        if (qIndex === -1){
            const secret = this.substringAfterLast(uri, '/')
            return { secret, digits, period, algo, issuer }
        }

        // If the uri DOES have parameters, parse them as a
        // URLSearchParams object.
        // eg. otpauth://totp/Facebook:myusername?issuer=Facebook&secret=abc
        const querystring = this.substringAfterFirst(uri, '?');
        const params = new URLSearchParams(querystring);
        const digitParam = params.get('digits');
        const periodParam = params.get('period');
        return {
            secret: params.get('secret') ?? '',
            digits: digitParam !== null ? parseInt(digitParam) : digits,
            period: periodParam !== null ? parseInt(periodParam) : period,
            algo: params.get('algorithm') ?? algo,
            issuer: params.get('issuer') ?? issuer
        }

    }

    parseAegis(str: string){
        const json = JSON.parse(str) as IAegisJson;
        return json.db.entries.map<GenericJsonEntry>(data => {
            const { type, name, issuer, info } = data;
            const {secret, algo, digits, period } = info;
            return new GenericJsonEntry({ type, name, issuer, secret, algo, digits, period, websites:[] })
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
            const secret = this.substringAfterLast(totp, '/');

            const websites = login.uris.map(u => u.uri)

            items.push(new GenericJsonEntry({
                type: "totp",
                name: '', // TODO username?
                issuer: name,
                secret,
                digits: 6,
                algo: "sha1",
                period: 30,
                websites
            }))
        });
        return items
    }

    parseTwoFAuth(str: string){
        const json = JSON.parse(str) as ITwoFAuthExport;
        return json.data.map<GenericJsonEntry>(data => {
            return new GenericJsonEntry({
                type: data.otp_type,
                name: data.account,
                issuer: data.service,
                secret: data.secret,
                digits: data.digits,
                algo: data.algorithm,
                period: data.period,
                websites: []
            })
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

class GenericJsonEntry implements IGenericJsonEntry{

    type: string; // "totp", "steam"
    name: string; // service name
    issuer: string;
    secret: string;
    algo: string; // eg. "SHA1"
    digits: number; // 6 for totp, 5 for steam,
    period: number; // usually 30
    websites: Array<string>;

    constructor(args: IGenericJsonEntry){
        const { type, name, issuer, secret, algo, digits, period, websites } = args;

        // Name or issuer is required.
        // Otherwise we can't identify which service the token belongs to.
        if (name.length === 0 && issuer.length === 0){
            throw new Error("Name and issuer cannot both be empty");
        }

        // If there's no secret, then it's not a TOTP 2FA token
        if (secret.length === 0){
            throw new Error("No secret provided");
        }

        if (algo.length === 0 || digits <= 0 || period <= 0){
            throw new Error("Invalid token");
        }

        this.type = type;
        this.name = name;
        this.issuer = issuer;
        this.secret = secret;
        this.algo = algo;
        this.digits = digits;
        this.period = period;
        this.websites = websites;

    }

    buildOtpAuthUri(){

        // In theory this shouldn't happen, since the constructor
        // checks for this.
        if (this.issuer.length === 0 && this.name.length === 0){
            throw new Error("Invalid token - issuer or name must be provided");
        }else if (this.secret.length === 0){
            throw new Error("Invalid token - secret must be provided");
        }else if (this.algo.length === 0 || this.digits <= 0 || this.period <= 0){
            throw new Error("Invalid token");
        }

        const params = [
            `secret=${this.secret}`,
            `algorithm=${this.algo}`,
            `digits=${this.digits}`,
            `period=${this.period}`
        ];
        const serviceNameArr = [];

        if (this.issuer.length > 0){
            const encodedIssuer = encodeURIComponent(this.issuer);
            serviceNameArr.push(this.issuer);
            params.push(`issuer=${encodedIssuer}`)
        }

        if (this.name.length > 0){
            serviceNameArr.push(this.name);
        }
        
        // eg. Facebook:myaccountname
        const serviceName = encodeURIComponent(serviceNameArr.join(':'))

        // Query string params, eg. issuer=test&period=30&digits=6
        const paramString = params.join("&");
        
        return `otpauth://totp/${serviceName}?${paramString}`;

    }

}
