import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <>
      <Head>
        <title>Guestbook</title>
        <meta
          name="description"
          content="Sign the guestbook (created with create-t3-app)"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative m-4 flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl">Guestbook</h1>
        {status === "loading" ? (
          <span className="animate-pulse text-violet-300">Loading...</span>
        ) : session ? (
          <>
            <button
              className="absolute right-0 top-0 rounded-full bg-violet-200/30 px-4 py-2 hover:bg-violet-200/50"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
            <Form />
          </>
        ) : (
          <button
            className="absolute right-0 top-0 rounded-full bg-violet-200/30 px-4 py-2 hover:bg-violet-200/50"
            onClick={() => signIn("discord")}
          >
            Sign In with Discord
          </button>
        )}
      </main>
    </>
  );
};

export default Home;

const Form = () => {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!message.trim()) return;
      }}
    >
      <label htmlFor="message" className="pl-4">
        Sign the guestbook!
      </label>
      <div className="flex overflow-hidden rounded-full border border-transparent">
        <input
          id="message"
          type="text"
          placeholder="Enter your message"
          minLength={2}
          maxLength={100}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border-none px-4 py-2 text-neutral-900 outline-none"
        />
        <button
          type="submit"
          className="border-none bg-violet-300/30 py-2 pl-3 pr-4 outline-none hover:bg-violet-300/50"
        >
          Sign
        </button>
      </div>
    </form>
  );
};
