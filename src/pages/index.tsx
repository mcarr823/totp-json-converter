import Heading from "@/components/Heading";
import ListItem from "@/components/ListItem";
import Wrapper from "@/components/Wrapper";
import { FormatNames } from "@/enums/FormatNames";
import IAppData from "@/interfaces/IAppData";

export default function Home({ setInputFormat } : IAppData) {

  return (
    <Wrapper>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-center">
        <Heading text="Step #1: Input Format"/>
        <p className="m-3 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Select the type of 2FA data you want to convert from
        </p>
        <ListItem
          text="Bitwarden"
          onClick={() => setInputFormat(FormatNames.BITWARDEN)}
          href="/step2"
          />
        <ListItem
          text="2FAuth"
          onClick={() => setInputFormat(FormatNames.TWOFAUTH)}
          href="/step2"
          />
        <ListItem
          text="Aegis"
          onClick={() => setInputFormat(FormatNames.AEGIS)}
          href="/step2"
          />
        <ListItem
          text="Proton"
          onClick={() => setInputFormat(FormatNames.PROTON)}
          href="/step2"
          />
      </div>

    </Wrapper>
  );
}
