import Head from "next/head";
import {ProgramBuilder} from "@/components/ProgramBuilder";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fitness Program Prompt Builder</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center p-6">
        <ProgramBuilder />
      </main>
    </>
  );
}
