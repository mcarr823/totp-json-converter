import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";
import IAegisExport from "@/interfaces/IAegisExport";
import IBitwardenExport from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport from "@/interfaces/ITwoFAuthExport";


const TAG = "Proton import ->"

const testjson = {
    "encrypted": false,
    "userId": "test",
    "vaults":
    {
        "vault2":
        {
            "name": "Personal",
            "description": "Personal vault",
            "display":
            {
                "color": 0,
                "icon": 0
            },
            "items":
            [
                {
                    "itemId": "item1",
                    "shareId": "share1",
                    "data":
                    {
                        "metadata":
                        {
                            "name": "my.domain.com",
                            "note": "",
                            "itemUuid": "15b83727"
                        },
                        "extraFields":
                        [],
                        "platformSpecific":
                        {
                            "android":
                            {
                                "allowedApps":
                                []
                            }
                        },
                        "type": "login",
                        "content":
                        {
                            "username": "me@my.domain.com",
                            "password": "",
                            "urls":
                            [
                                "https://my.domain.com/login",
                                "https://my.domain.com/"
                            ],
                            "totpUri": "",
                            "passkeys":
                            [
                            ]
                        },
                        "lastRevision": 4
                    },
                    "state": 1,
                    "aliasEmail": null,
                    "contentFormatVersion": 3,
                    "createTime": 1697597454,
                    "modifyTime": 1715201864,
                    "pinned": false
                },
                {
                    "itemId": "item2",
                    "shareId": "share2",
                    "data":
                    {
                        "metadata":
                        {
                            "name": "account.proton.me",
                            "note": "",
                            "itemUuid": "f2ded5eb"
                        },
                        "extraFields":
                        [],
                        "platformSpecific":
                        {
                            "android":
                            {
                                "allowedApps":
                                [
                                    {
                                        "packageName": "me.proton.android.drive",
                                        "hashes":
                                        [
                                            "me.proton.android.drive"
                                        ],
                                        "appName": "me.proton.android.drive"
                                    },
                                    {
                                        "packageName": "ch.protonvpn.android",
                                        "hashes":
                                        [],
                                        "appName": "Proton VPN"
                                    },
                                    {
                                        "packageName": "ch.protonmail.android",
                                        "hashes":
                                        [],
                                        "appName": "Proton Mail"
                                    },
                                    {
                                        "packageName": "me.proton.android.calendar",
                                        "hashes":
                                        [],
                                        "appName": "Proton Calendar"
                                    }
                                ]
                            }
                        },
                        "type": "login",
                        "content":
                        {
                            "username": "me@my.domain.com",
                            "password": "",
                            "urls":
                            [
                                "https://account.proton.me/login",
                                "https://account.proton.me"
                            ],
                            "totpUri": "otpauth://totp/Proton:proton%40my.domain.com?issuer=Proton&secret=abc123&algorithm=SHA1&digits=6&period=30",
                            "passkeys":
                            []
                        }
                    },
                    "state": 1,
                    "aliasEmail": null,
                    "contentFormatVersion": 1,
                    "createTime": 1697597454,
                    "modifyTime": 1708056761,
                    "pinned": false
                },
            ]
        }
    }
}

const teststring = JSON.stringify(testjson);
const tfa = new GenericJson(teststring, FormatNames.PROTON);

test(`${TAG} Parse length`, () => {
    // There are 2 entries, but only 1 is valid
    expect(tfa.entries.length).toBe(1);
})

test(`${TAG} Parse TOTP`, () => {
    const obj = tfa.entries[0];
    expect(obj.type).toBe("totp");
    expect(obj.name).toBe("me@my.domain.com");
    expect(obj.issuer).toBe("Proton");
    expect(obj.secret).toBe("abc123");
    expect(obj.digits).toBe(6);
    expect(obj.algo).toBe("SHA1");
    expect(obj.period).toBe(30);
})

test(`${TAG} Aegis export`, () => {
    const json: IAegisExport = {
        "db":{
            "entries":[
                {
                    "type":"totp",
                    "name":"me@my.domain.com",
                    "issuer":"Proton",
                    "info":{
                        "secret":"abc123",
                        "digits":6,
                        "algo":"SHA1",
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
                "name":"Proton",
                "login":{
                    "totp":"otpauth://totp/Proton%3Ame%40my.domain.com?secret=abc123&algorithm=SHA1&digits=6&period=30&issuer=Proton",
                    "uris":[
                        {match:null, uri:"https://account.proton.me/login"},
                        {match:null, uri:"https://account.proton.me"}
                    ]
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
                "account":"me@my.domain.com",
                "service":"Proton",
                "secret":"abc123",
                "digits":6,
                "algorithm":"SHA1",
                "period":30,
                "counter":null,
                "legacy_uri":"otpauth://totp/Proton%3Ame%40my.domain.com?secret=abc123&algorithm=SHA1&digits=6&period=30&issuer=Proton"
            }
        ]
    };
    const result = JSON.stringify(json);
    expect(tfa.export(FormatNames.TWOFAUTH)).toBe(result);
})