import GenericJson from "@/classes/GenericJson";
import { FormatNames } from "@/enums/FormatNames";
import IAegisExport from "@/interfaces/IAegisExport";
import IBitwardenExport from "@/interfaces/IBitwardenExport";
import ITwoFAuthExport from "@/interfaces/ITwoFAuthExport";

const TAG = "Bitwarden import ->"

const testjson = {
  "items": [
    {
    "type": 1,
    "name": "Login Item's Name",
    "login": {
      "totp": "otpauth://totp/mysecret",
      "uris":[{
        "match":null,
        "uri":"https://my.domain.com"
      }]
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
  },
  {
  "type": 1,
  "name": "MyUsername",
  "login": {
    "totp": "otpauth://totp/MyUsername?issuer=Facebook&secret=abc123",
    "uris":[{
      "match":null,
      "uri":"https://my.domain.com"
    }]
  }
},
  ]
};

const teststring = JSON.stringify(testjson);
const bw = new GenericJson(teststring, FormatNames.BITWARDEN);

test(`${TAG} Parse length`, () => {
  // Only 2 of the 5 items are actually 2FA tokens (type === 1)
  expect(bw.entries.length).toBe(2);
})

test(`${TAG} Parse TOTP`, () => {
  const token = bw.entries[0];
  expect(token.secret).toBe("mysecret")
})

test(`${TAG} Parse TOTP 2`, () => {
  const token = bw.entries[1];
  expect(token.secret).toBe("abc123")
  expect(token.issuer).toBe("Facebook")
  expect(token.name).toBe("MyUsername")
})

test(`${TAG} Aegis export`, () => {
  const json: IAegisExport = {
    "db":{
      "entries":[
        {
          "type":"totp",
          "name":"",
          "issuer":"Login Item's Name",
          "info":{
            "secret":"mysecret",
            "digits":6,
            "algo":"sha1",
            "period":30
          }
        },
        {
          "type":"totp",
          "name":"MyUsername",
          "issuer":"Facebook",
          "info":{
            "secret":"abc123",
            "digits":6,
            "algo":"sha1",
            "period":30
          }
        }
      ]
    }
  }
  const result = JSON.stringify(json)
  expect(bw.export(FormatNames.AEGIS)).toBe(result)
})

test(`${TAG} Bitwarden export`, () => {
  const json: IBitwardenExport = {
    "items":[
      {
        "type":1,
        "name":"Login Item's Name",
        "login":{
          "totp":"otpauth://totp/Login%20Item's%20Name?secret=mysecret&algorithm=sha1&digits=6&period=30&issuer=Login%20Item's%20Name",
          "uris":[
            {
              match:null,
              uri:"https://my.domain.com"
            }
          ]
        }
      },
      {
        "type":1,
        "name":"Facebook",
        "login":{
          "totp":"otpauth://totp/Facebook%3AMyUsername?secret=abc123&algorithm=sha1&digits=6&period=30&issuer=Facebook",
          "uris":[
            {
              match:null,
              uri:"https://my.domain.com"
            }
          ]
        }
      }
    ]
  }
  const result = JSON.stringify(json)
  expect(bw.export(FormatNames.BITWARDEN)).toBe(result);
})

test(`${TAG} 2FAuth export`, () => {
  const json: ITwoFAuthExport = {
    "data":[
      {
        "otp_type":"totp",
        "account":"",
        "service":"Login Item's Name",
        "secret":"mysecret",
        "digits":6,
        "algorithm":"sha1",
        "period":30,
        "counter":null,
        "legacy_uri":"otpauth://totp/Login%20Item's%20Name?secret=mysecret&algorithm=sha1&digits=6&period=30&issuer=Login%20Item's%20Name"
      },
      {
        "otp_type":"totp",
        "account":"MyUsername",
        "service":"Facebook",
        "secret":"abc123",
        "digits":6,
        "algorithm":"sha1",
        "period":30,
        "counter":null,
        "legacy_uri":"otpauth://totp/Facebook%3AMyUsername?secret=abc123&algorithm=sha1&digits=6&period=30&issuer=Facebook"
      },
    ]
  }
  const result = JSON.stringify(json)
  expect(bw.export(FormatNames.TWOFAUTH)).toBe(result)
})
