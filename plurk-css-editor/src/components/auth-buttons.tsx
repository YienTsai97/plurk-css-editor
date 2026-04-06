"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading…</button>;

  if (session) {
    return (
      <button
        className="px-3 py-1 rounded border"
        onClick={() => signOut({
          callbackUrl: "/",
          redirect: true
        })}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      className="px-3 py-1 rounded border"
      onClick={() => signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true
      })}
    >
      Sign in with Google
    </button>
  );
}
