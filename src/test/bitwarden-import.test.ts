import BitwardenJson from "@/classes/BitwardenJson";
import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";

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

    const bw = new GenericJson(teststring, FormatNames.BITWARDEN);

    // Only 1 of the 4 items is actually a 2FA token (type === 1)
    expect(bw.entries.length).toBe(1);

    const token = bw.entries[0];
    expect(token.secret).toBe("mysecret")

    const exportVal = `{"items":[{"type":1,"name":"Login Item's Name","login":{"totp":"otpauth://totp/mysecret"}}]}`;
    expect(bw.export(FormatNames.BITWARDEN)).toBe(exportVal);

})
