export default interface IAppData{
    inputFormat: string;
    outputFormat: string;
    setInputFormat: (value: string) => void;
    setOutputFormat: (value: string) => void;
}