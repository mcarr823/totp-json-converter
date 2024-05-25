# TOTP JSON Converter

This program converts JSON files between a few different 2FA providers' formats.

The intended use for this program is to move from one 2FA provider to another by exporting your tokens from one provider and converting them into a different format.

Supported services/formats are:

- [Aegis](https://getaegis.app/)
- [Bitwarden](https://bitwarden.com/)
- [2FAuth](https://docs.2fauth.app/)
- [Proton Pass](https://pass.proton.me/) (import only)

Other services will work as well, as long as they support the format provided by one of the above services.

For example, several 2FA services support importing data which is stored in the Bitwarden JSON format.

## Limitations

- Doesn't support encrypted exports
- Doesn't support folders, collections, or other groupings
- Only supports 2FA tokens, not passwords, passkeys, etc.
- Only supports TOTP, not HOTP or others

## Example Website

You can run a statically compiled version of the website deployed via Github Actions and hosted on Github Pages.

https://mcarr823.github.io/totp-json-converter/

The token conversion runs client-side (ie. in your browser) and does not upload your data anywhere. 

If you want to be extra cautious, you can turn off your internet connection for step 3 of the process (the part where you actually enter and convert your tokens).

Or, better yet, follow the Development section below and run the code directly on your own machine.

## Development

### Dev Container

The easiest way to develop this application is to run the dev container provided.

Microsoft provide instructions on setting up and running dev containers [here](https://code.visualstudio.com/docs/devcontainers/containers).

### Locally

Alternatively, you can develop the app by installing NodeJS v20 and running

`npm i`

to install the app's dependencies, then

`npm run dev`

to run it.
