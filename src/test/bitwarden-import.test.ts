import BitwardenJson from "@/classes/BitwardenJson";

const testjson = {
    "items": [
      {
      "type": 1,
      "name": "Login Item's Name",
      "login": {
        "totp": "otpauth://totp/mysecret"
      }
    },
    {
      "type": 2,
      "name": "Secure Note Item's Name",
      "secureNote": {}                     
    },
    {
      "type": 3,
      "name": "Card Item's Name",
      "card": {}                         
    },
    {
      "type": 4,
      "name": "Identity Item's Name",
      "identity": {}                     
    }
    ]
  };

const teststring = JSON.stringify(testjson);

test("Test the importing and exporting of basic bitwarden JSON", () => {

    const bw = BitwardenJson.parse(teststring);

    // Only 1 of the 4 items is actually a 2FA token (type === 1)
    expect(bw.items.length).toBe(1);

    const token = bw.items[0];
    expect(token.secret).toBe("mysecret")
    expect(token.login.totp).toBe("otpauth://totp/mysecret")

    const exportVal = `{"items":[{"type":1,"name":"Login Item's Name","login":{"totp":"otpauth://totp/mysecret"},"secret":"mysecret"}]}`;
    expect(bw.export()).toBe(exportVal);

})
