import Heading from "@/components/Heading";
import SubmitButton from "@/components/SubmitButton";
import Wrapper from "@/components/Wrapper";
import styles from '@/css/Textarea.module.css';
import { useEffect, useState } from "react";
import GenericJson from "@/classes/GenericJson";
import IAppData from "@/interfaces/IAppData";

export default function Home({ inputFormat, outputFormat } : IAppData) {

  // Replace state so that refreshing the page will take you back to the start.
  // useEffect is used so that this step won't happen server-side during pre-render
  useEffect(() => {
    
    // Grab the existing path and remove the last 5 chars (step2 or step3)
    // It's done this way so that the path replacement will work whether the site
    // is hosted in a subdirectory or not
    const pathName = window.location.pathname
    const newPath = pathName.substring(0, pathName.length - 5)

    window.history.replaceState(null, "", newPath)
    
  })

  const [text, setText] = useState("");
  const [status, setStatus] = useState("Enter the JSON you want to convert");

  const submit = () => {
    setStatus("Validating...")
    try {
      const json = new GenericJson(text, inputFormat);
      const result = json.export(outputFormat);

      setStatus("Success! Converted JSON below");
      setText(result);
    } catch (error) {
      console.error(error);
      setStatus("Error: "+error);
      return;
    }
  };

  return (
    <Wrapper>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-center">
        <Heading text="Step #3: Export"/>
        <p className="m-3 fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Converting from {inputFormat} to {outputFormat}<br/>
          {status}
        </p>
        <textarea
          className={styles.textarea}
          placeholder="Enter your JSON here"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="text-right m-3">
          <SubmitButton
            text="Submit"
            click={submit}
          />
        </div>
      </div>

    </Wrapper>
  );
}
