import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {

  const [inputFormat, setInputFormat] = useState("")
  const [outputFormat, setOutputFormat] = useState("")

  return (
    <Component
      {...pageProps}
      inputFormat={inputFormat}
      outputFormat={outputFormat}
      setInputFormat={setInputFormat}
      setOutputFormat={setOutputFormat}
      />);
}
