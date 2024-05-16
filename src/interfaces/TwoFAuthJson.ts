export default interface TwoFAuthJson{
    app: string; //eg. 2fauth_v5.1.1
    schema: number;
    datetime: string; //eg. 2024-05-14T08:57:35.542766Z
    data: Array<Token>;
}

interface Token{
    otp_type: string; // totp, steamtotp
    account: string; //email
    service: string | null; //service name
    icon: string | null; //filename, eg. myserviceicon.jpg
    icon_mime: string | null; //mime type, eg. image/jpg
    icon_file: string | null; //base64 encoded icon
    secret: string;
    digits: number; //usually 6 for totp, 5 for steamotp
    algorithm: string; //eg. sha1
    period: number;
    counter: null;
    legacy_uri: string; //eg. otpauth://totp/blahblah
}