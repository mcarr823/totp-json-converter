import Link from "next/link";

export default function ListItem(args : IListItem){

    const { href, text, subtext, onClick } = args;

    const bottomMargin = typeof subtext !== 'undefined' ? 'mb-3 ' : '';

    return (
        <Link
        onClick={onClick}
        href={href}
        className="lg:text-left group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        rel="noopener noreferrer"
        replace
        >
            <h2 className={ bottomMargin + `text-2xl font-semibold` }>
                {text}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
                </span>
            </h2>
            <Subtext text={subtext}/>
        </Link>
    );
}

function Subtext({ text } : { text?: string }){

    if (typeof text === 'undefined'){
        return (<></>);
    }

    return (
        <p className={`m-0 text-sm opacity-50`}>
            {text}
        </p>
    );

}

interface IListItem{
    href: string;
    text: string;
    subtext?: string;
    onClick: () => void;
}