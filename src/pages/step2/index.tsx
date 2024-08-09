import Heading from "@/components/Heading";
import ListItem from "@/components/ListItem";
import Wrapper from "@/components/Wrapper";
import { FormatNames } from "@/enums/FormatNames";
import IAppData from "@/interfaces/IAppData";
import { useEffect } from "react";

export default function Home({ inputFormat, setOutputFormat } : IAppData) {

  // Replace state so that refreshing the page will take you back to the start.
  // useEffect is used so that this step won't happen server-side during pre-render
  useEffect(() => {
    window.history.replaceState(null, "", "/")
  })

  return (
    <Wrapper>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-center">
        <Heading text="Step #2: Output Format"/>
        <p className="m-3 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Convert from {inputFormat} to...
        </p>
        <ListItem
          text="Bitwarden"
          onClick={() => setOutputFormat(FormatNames.BITWARDEN)}
          href="/step3"
          />
        <ListItem
          text="2FAuth"
          onClick={() => setOutputFormat(FormatNames.TWOFAUTH)}
          href="/step3"
          />
        <ListItem
          text="Aegis"
          onClick={() => setOutputFormat(FormatNames.AEGIS)}
          href="/step3"
          />
        <ListItem
          text="Proton"
          onClick={() => setOutputFormat(FormatNames.BITWARDEN)}
          subtext="This option actually exports to Bitwarden format, which Proton Pass is able to import"
          href="/step3"
          />
      </div>

    </Wrapper>
  );
}
