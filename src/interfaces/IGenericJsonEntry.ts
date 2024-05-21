interface IGenericJsonEntry{

    type: string; // "totp", "steam"
    name: string; // service name
    issuer: string;
    secret: string;
    algo: string; // eg. "SHA1"
    digits: number; // 6 for totp, 5 for steam,
    period: number; // usually 30
    websites: Array<string>;

}