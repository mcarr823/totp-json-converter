import { IGenericJsonEntry } from "@/interfaces/IGenericJsonEntry";

export class GenericJsonEntry{

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