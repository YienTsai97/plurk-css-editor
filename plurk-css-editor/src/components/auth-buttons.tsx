"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") return <button disabled>Loading…</button>;

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <img src={session.user?.image ?? ""} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm">Hi, {session.user?.name ?? session.user?.email}</span>
        <button
          className="px-3 py-1 rounded border"
          onClick={() => signOut({
            callbackUrl: "/",
            redirect: true
          })}
        >
          Sign out
        </button>
      </div>
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
