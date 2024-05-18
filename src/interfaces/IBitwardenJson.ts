export default interface IBitwardenJson{
    encrypted: boolean;
    folders: Array<IFolder>;
    items: Array<IItem>
}

interface IFolder{
    id: string;
    name: string;
}

export interface IItem{
    passwordHistory: null;
    revisionDate: string;
    creationDate: string;
    deletedDate: null;
    id: string;
    organizationId: null;
    folderId: null;
    type: number;
    reprompt: number;
    name: string;
    notes: string;
    favorite: boolean;
    secureNote: ISecureNote | undefined;
    card: ICard | undefined;
    fields: Array<IField>;
    login: ILogin | undefined;
    identity: IIdentity | undefined;
    collectionIds: null;
}

interface ISecureNote{
    type: number;
}

interface ICard{
    cardholderName: string;
    brand: null;
    number: string;
    expMonth: string;
    expYear: string;
    code: string;
}

interface IField{
    name: string;
    value: string;
    type: number;
    linkedId: null;
}

interface ILogin{
    uris: Array<ILoginUri>;
    username: string;
    password: string;
    totp: string | null;
}

interface ILoginUri{
    match: null;
    uri: string;
}

interface IIdentity{
    title: string;
    firstName: string;
    middleName: string;
    lastName: string;
    address1: string;
    address2: null;
    address3: null;
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