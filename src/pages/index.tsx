import Heading from "@/components/Heading";
import ListItem from "@/components/ListItem";
import Wrapper from "@/components/Wrapper";
import { FormatNames } from "@/enums/FormatNames";

export default function Home() {

  const getPath = (name: string) => `/step2/${name}`;

  return (
    <Wrapper>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-center">
        <Heading text="Step #1: Input Format"/>
        <p className="m-3 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Select the type of 2FA data you want to convert from
        </p>
        <ListItem text="Bitwarden" href={getPath(FormatNames.BITWARDEN)}/>
        <ListItem text="2FAuth" href={getPath(FormatNames.TWOFAUTH)}/>
        <ListItem text="Aegis" href={getPath(FormatNames.AEGIS)}/>
      </div>

    </Wrapper>
  );
}
