import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";
import IAegisExport from "@/interfaces/IAegisExport";
import IBitwardenExport from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport from "@/interfaces/ITwoFAuthExport";

const TAG = "2FAuth import ->"

const testjson = {
    "app": "2fauth_v5.1.1",
    "schema": 1,
    "datetime": "2024-04-07T12:16:29.606564Z",
    "data": [
        {
            "otp_type": "totp",
            "account": "johndoe@facebook.com",
            "service": "Facebook",
            "icon": "82yCBkDNghIMJ0RfTkFHLPGFaEZSimAWPB4PMVhT.png",
            "icon_mime": "image\/png",
            "icon_file": "iVBORw0KGgoAAAA[...]RU5ErkJggg==",
            "secret": "A4GRFTVVRBGY7UIW",
            "digits": 6,
            "algorithm": "sha1",
            "period": 30,
            "counter": null,
            "legacy_uri": "otpauth:\/\/totp\/Facebook%3Ajohndoe%40facebook.com?issuer=Facebook&secret=A4GRFTVVRBGY7UIW"
        }
    ]
};

const teststring = JSON.stringify(testjson);
const tfa = new GenericJson(teststring, FormatNames.TWOFAUTH);

test(`${TAG} Parse length`, () => {
    expect(tfa.entries.length).toBe(1);
})

test(`${TAG} Parse TOTP`, () => {
    const obj = tfa.entries[0];
    expect(obj.type).toBe("totp");
    expect(obj.name).toBe("johndoe@facebook.com");
    expect(obj.issuer).toBe("Facebook");
    expect(obj.secret).toBe("A4GRFTVVRBGY7UIW");
    expect(obj.digits).toBe(6);
    expect(obj.algo).toBe("sha1");
    expect(obj.period).toBe(30);
})

test(`${TAG} Aegis export`, () => {
    const json: IAegisExport = {
        "db":{
            "entries":[
                {
                    "type":"totp",
                    "name":"johndoe@facebook.com",
                    "issuer":"Facebook",
                    "info":{
                        "secret":"A4GRFTVVRBGY7UIW",
                        "digits":6,
                        "algo":"sha1",
                        "period":30
                    }
                }
            ]
        }
    };
    const result = JSON.stringify(json);
    expect(tfa.export(FormatNames.AEGIS)).toBe(result);
})

test(`${TAG} Bitwarden export`, () => {
    const json: IBitwardenExport = {
        "items":[
            {
                "type":1,
                "name":"Facebook",
                "login":{
                    "totp":"otpauth://totp/A4GRFTVVRBGY7UIW"
                }
            }
        ]
    }
    const result = JSON.stringify(json);
    expect(tfa.export(FormatNames.BITWARDEN)).toBe(result);
})

test(`${TAG} 2FAuth export`, () => {
    const json: ITwoFAuthExport = {
        "data":[
            {
                "otp_type":"totp",
                "account":"johndoe@facebook.com",
                "service":"Facebook",
                "secret":"A4GRFTVVRBGY7UIW",
                "digits":6,
                "algorithm":"sha1",
                "period":30,
                "counter":null,
                "legacy_uri":"otpauth://totp/Facebook%3Ajohndoe%40facebook.com?issuer=Facebook&secret=A4GRFTVVRBGY7UIW"
            }
        ]
    };
    const result = JSON.stringify(json);
    expect(tfa.export(FormatNames.TWOFAUTH)).toBe(result);
})