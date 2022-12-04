import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

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
      <main className="flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-3xl">Guestbook</h1>
        {status === "loading" ? (
          <span className="animate-pulse text-violet-300">Loading...</span>
        ) : session ? (
          <div className="flex flex-col items-center gap-2">
            <button
              className="rounded-full bg-violet-200/30 px-4 py-2 hover:bg-violet-200/50"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="rounded-full bg-violet-200/30 px-4 py-2 hover:bg-violet-200/50"
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
