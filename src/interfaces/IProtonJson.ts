interface IProtonJson {
    encrypted: boolean;
    vaults: {
        [vaultUuid: string]: {
            items: Array<ProtonItem>
        }
    }
}

interface ProtonItem{
    data: ProtonData
}

interface ProtonData{
    metadata: ProtonMetadata,
    type: string; // "login"
    content: ProtonContent
}

interface ProtonMetadata{
    name: string; // issuer
}

interface ProtonContent{
    username: string;
    urls: Array<string>;
    totpUri: string;
}