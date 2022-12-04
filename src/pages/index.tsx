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
            <Messages />
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

const Messages = () => {
  const { data: messages, isLoading } = trpc.guestbook.getAll.useQuery();

  if (isLoading) {
    return (
      <span className="animate-pulse text-center text-violet-400">
        Loading messages...
      </span>
    );
  }

  return messages && messages.length > 0 ? (
    <div className="w-full max-w-lg rounded-lg border-2 border-violet-200">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="border-b border-violet-200 p-2 last:border-none"
        >
          <p>{msg.message}</p>
          <span className="text-sm text-neutral-400">{msg.name}</span>
        </div>
      ))}
    </div>
  ) : (
    <p className="italic text-neutral-300">No messages</p>
  );
};

const Form = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const postMessage = trpc.guestbook.postMessage.useMutation();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (!message.trim()) return;

        postMessage.mutate({
          name: session?.user?.name as string,
          message,
        });
        setMessage("");
      }}
    >
      <label htmlFor="message" className="pl-2">
        Sign the guestbook!
      </label>
      <div className="flex gap-2">
        <input
          id="message"
          type="text"
          placeholder="Enter your message"
          minLength={2}
          maxLength={100}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded-lg p-2 text-neutral-900 outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-violet-300/30 py-2 px-4 outline-none hover:bg-violet-300/50"
        >
          Sign
        </button>
      </div>
    </form>
  );
};
