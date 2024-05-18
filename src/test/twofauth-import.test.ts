import TwoFAuthJson from "@/classes/TwoFAuthJson";

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

test("", () => {

    const tfa = TwoFAuthJson.parse(teststring);
    expect(tfa.data.length).toBe(1);
    
    const obj = tfa.data[0];
    expect(obj.otp_type).toBe("totp");
    expect(obj.account).toBe("johndoe@facebook.com");
    expect(obj.service).toBe("Facebook");
    expect(obj.secret).toBe("A4GRFTVVRBGY7UIW");
    expect(obj.digits).toBe(6);
    expect(obj.algorithm).toBe("sha1");
    expect(obj.period).toBe(30);
    expect(obj.counter).toBe(null);
    expect(obj.legacy_uri).toBe("otpauth:\/\/totp\/Facebook%3Ajohndoe%40facebook.com?issuer=Facebook&secret=A4GRFTVVRBGY7UIW");

    const result = `{"data":[{"otp_type":"totp","account":"johndoe@facebook.com","service":"Facebook","secret":"A4GRFTVVRBGY7UIW","digits":6,"algorithm":"sha1","period":30,"counter":null,"legacy_uri":"otpauth://totp/Facebook%3Ajohndoe%40facebook.com?issuer=Facebook&secret=A4GRFTVVRBGY7UIW"}]}`;
    expect(tfa.export()).toBe(result);

})