import Heading from "@/components/Heading";
import ListItem from "@/components/ListItem";
import Wrapper from "@/components/Wrapper";
import { FormatNames } from "@/enums/FormatNames";
import { useRouter } from "next/router";

export default function Home() {
    
  const router = useRouter();
  const query = router.query;
  const { slug } = query;
  const [inputFormat] = (typeof slug === 'undefined') ?
    [''] :
    slug as Array<string>;

  const getPath = (name: string) => `/step3/${inputFormat}/${name}`;

  return (
    <Wrapper>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-center">
        <Heading text="Step #2: Output Format"/>
        <p className="m-3 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Convert from {inputFormat} to...
        </p>
        <ListItem text="Bitwarden" href={getPath(FormatNames.BITWARDEN)}/>
        <ListItem text="2FAuth" href={getPath(FormatNames.TWOFAUTH)}/>
        <ListItem text="Aegis" href={getPath(FormatNames.AEGIS)}/>
        <ListItem text="Proton" href={getPath(FormatNames.BITWARDEN)} subtext="This option actually exports to Bitwarden format, which Proton Pass is able to import"/>
      </div>

    </Wrapper>
  );
}
