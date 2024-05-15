interface BitwardenJson{
    encrypted: boolean;
    folders: Array<Folder>;
    items: Array<Item>
}

interface Folder{
    id: string;
    name: string;
}

interface Item{
    passwordHistory: null;
    revisionDate: string;
    creationDate: string;
    deletedDate: null,
    id: string;
    organizationId: null,
    folderId: null,
    type: number;
    reprompt: number;
    name: string;
    notes: string;
    favorite: boolean;
    secureNote: {
      type: number;
    };
    card: Card;
    fields: Array<Field>;
    login: Login,
    identity: Identity,
    collectionIds: null
}

interface Card{
    cardholderName: string;
    brand: null,
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
}

interface Field{
    name: string;
    value: string;
    type: number;
    linkedId: null
}

interface Login{
    uris: Array<LoginUri>;
    username: string;
    password: string;
    totp: null
}

interface LoginUri{
    match: null;
    uri: string;
}

interface Identity{
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: null,
    address3: null,
    city: string;
    state: string;
    postalCode: string;
    country: string;
    company: string;
    email: string;
    phone: string;
    ssn: string;
    username: string;
    passportNumber: string;
    licenseNumber: string;
}