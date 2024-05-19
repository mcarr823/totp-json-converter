import IAppData from "@/interfaces/IAppData";
import { ParsedUrlQuery } from "querystring";

export default class AppDataViewModel implements IAppData{
    
    inputFormat: string;
    outputFormat: string;

    constructor(args : IAppData){
        this.inputFormat = args.inputFormat;
        this.outputFormat = args.outputFormat;
    }

    static fromQueryString(query: ParsedUrlQuery){
        if (typeof query.data !== 'string'){
            throw new Error("Data argument not specified");
        }
        return JSON.parse(query.data) as AppDataViewModel;
    }

}