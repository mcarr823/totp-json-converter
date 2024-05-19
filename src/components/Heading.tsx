export default function Heading(args : IHeading){
    const { text } = args;
    return (
        <h1 className="mb-3 text-4xl font-semibold">{text}</h1>
    )
}

interface IHeading{
    text: string;
}