import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";
import IAegisExport from "@/interfaces/IAegisExport";
import IBitwardenExport from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport from "@/interfaces/ITwoFAuthExport";

const TAG = "Aegis import ->"

const testjson = {
    "version": 1,
    "header": {
        "slots": null,
        "params": null
    },
    "db": {
        "version": 3,
        "entries": [
            {
                "type": "totp",
                "uuid": "078c5a24-657d-4088-97a0-ce14102d2158",
                "name": "MEGA - MEGA:test@test.com",
                "issuer": "MEGA",
                "note": "",
                "favorite": false,
                "icon": null,
                "info": {
                    "secret": "abc123",
                    "algo": "SHA1",
                    "digits": 6,
                    "period": 30
                },
                "groups": []
            },
            {
                "type": "steam",
                "uuid": "0c919828-9d81-45d2-a0d7-0f9b5a703061",
                "name": "steam",
                "issuer": "",
                "note": "",
                "favorite": false,
                "icon": null,
                "info": {
                    "secret": "def345",
                    "algo": "SHA1",
                    "digits": 5,
                    "period": 30
                },
                "groups": []
            },
            {
                "type": "totp",
                "uuid": "af1f60d7-67ac-45c4-9d9c-de566377b61a",
                "name": "myGov",
                "issuer": "",
                "note": "",
                "favorite": false,
                "icon": null,
                "info": {
                    "secret": "efg456",
                    "algo": "SHA512",
                    "digits": 6,
                    "period": 30
                },
                "groups": []
            }
        ],
        "groups": []
    }
}

const teststring = JSON.stringify(testjson);
const tfa = new GenericJson(teststring, FormatNames.AEGIS)

test(`${TAG} Parse length`, () => {
    expect(tfa.entries.length).toBe(3);
})

test(`${TAG} Parse TOTP`, () => {
    const obj = tfa.entries[0];
    expect(obj.type).toBe("totp");
    expect(obj.name).toBe("MEGA - MEGA:test@test.com");
    expect(obj.issuer).toBe("MEGA");
    expect(obj.secret).toBe("abc123");
    expect(obj.digits).toBe(6);
    expect(obj.algo).toBe("SHA1");
    expect(obj.period).toBe(30);
})

test(`${TAG} Parse Steam`, () => {
    const obj = tfa.entries[1];
    expect(obj.type).toBe("steam");
    expect(obj.name).toBe("steam");
    expect(obj.issuer).toBe("");
    expect(obj.secret).toBe("def345");
    expect(obj.digits).toBe(5);
    expect(obj.algo).toBe("SHA1");
    expect(obj.period).toBe(30);
})

test(`${TAG} Parse SHA512`, () => {
    const obj = tfa.entries[2];
    expect(obj.type).toBe("totp");
    expect(obj.name).toBe("myGov");
    expect(obj.issuer).toBe("");
    expect(obj.secret).toBe("efg456");
    expect(obj.digits).toBe(6);
    expect(obj.algo).toBe("SHA512");
    expect(obj.period).toBe(30);
})

test(`${TAG} Aegis export`, () => {
    const json: IAegisExport = {
        "db": {
            "entries": [
                {
                    "type":"totp",
                    "name":"MEGA - MEGA:test@test.com",
                    "issuer":"MEGA",
                    "info":{
                        "secret":"abc123",
                        "digits":6,
                        "algo":"SHA1",
                        "period":30
                    }
                },
                {
                    "type":"steam",
                    "name":"steam",
                    "issuer":"",
                    "info":{
                        "secret":"def345",
                        "digits":5,
                        "algo":"SHA1",
                        "period":30
                    }
                },
                {
                    "type":"totp",
                    "name":"myGov",
                    "issuer":"",
                    "info":{
                        "secret":"efg456",
                        "digits":6,
                        "algo":"SHA512",
                        "period":30
                    }
                }
            ]
        }
    }
    const result = JSON.stringify(json)
    expect(tfa.export(FormatNames.AEGIS)).toBe(result);
})

test(`${TAG} Bitwarden export`, () => {
    const json: IBitwardenExport = {
        "items":[
            {
                "type":1,
                "name":"MEGA",
                "login":{
                    "totp":"otpauth://totp/abc123"
                }
            },
            {
                "type":1,
                "name":"",
                "login":{
                    "totp":"otpauth://totp/efg456"
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
                "account":"MEGA - MEGA:test@test.com",
                "service":"MEGA",
                "secret":"abc123",
                "digits":6,
                "algorithm":"SHA1",
                "period":30,
                "counter":null,
                "legacy_uri":"otpauth://totp/MEGA%3AMEGA%20-%20MEGA%3Atest%40test.com?issuer=MEGA&secret=abc123"
            },
            {
                "otp_type":"steam",
                "account":"steam",
                "service":"",
                "secret":"def345",
                "digits":5,
                "algorithm":"SHA1",
                "period":30,
                "counter":null,
                "legacy_uri":"otpauth://totp/steam?issuer=&secret=def345"
            },
            {
                "otp_type":"totp",
                "account":"myGov",
                "service":"",
                "secret":"efg456",
                "digits":6,
                "algorithm":"SHA512",
                "period":30,
                "counter":null,
                "legacy_uri":"otpauth://totp/myGov?issuer=&secret=efg456"
            }
        ]
    }
    const result = JSON.stringify(json);
    expect(tfa.export(FormatNames.TWOFAUTH)).toBe(result);
})