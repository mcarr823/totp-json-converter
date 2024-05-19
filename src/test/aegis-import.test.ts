import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";

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

test("", () => {

    const tfa = new GenericJson(teststring, FormatNames.AEGIS)
    expect(tfa.entries.length).toBe(3);
    
    const obj = tfa.entries[0];
    expect(obj.type).toBe("totp");
    expect(obj.name).toBe("MEGA - MEGA:test@test.com");
    expect(obj.issuer).toBe("MEGA");
    expect(obj.secret).toBe("abc123");
    expect(obj.digits).toBe(6);
    expect(obj.algo).toBe("SHA1");
    expect(obj.period).toBe(30);
    
    const obj2 = tfa.entries[1];
    expect(obj2.type).toBe("steam");
    expect(obj2.name).toBe("steam");
    expect(obj2.issuer).toBe("");
    expect(obj2.secret).toBe("def345");
    expect(obj2.digits).toBe(5);
    expect(obj2.algo).toBe("SHA1");
    expect(obj2.period).toBe(30);
    
    const obj3 = tfa.entries[2];
    expect(obj3.type).toBe("totp");
    expect(obj3.name).toBe("myGov");
    expect(obj3.issuer).toBe("");
    expect(obj3.secret).toBe("efg456");
    expect(obj3.digits).toBe(6);
    expect(obj3.algo).toBe("SHA512");
    expect(obj3.period).toBe(30);

    const result = `{"db":{"entries":[{"type":"totp","name":"MEGA - MEGA:test@test.com","issuer":"MEGA","info":{"secret":"abc123","digits":6,"algo":"SHA1","period":30}},{"type":"steam","name":"steam","issuer":"","info":{"secret":"def345","digits":5,"algo":"SHA1","period":30}},{"type":"totp","name":"myGov","issuer":"","info":{"secret":"efg456","digits":6,"algo":"SHA512","period":30}}]}}`;
    expect(tfa.export(FormatNames.AEGIS)).toBe(result);

})