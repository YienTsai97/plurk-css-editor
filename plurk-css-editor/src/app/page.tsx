import { authOptions } from "@/auth";
import AuthButtons from "@/components/auth-buttons";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(authOptions)
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Home</h1>
      <p className="text-sm text-gray-600">
        {session ? `Logged in as ${session.user ? session.user.email : "Unknown"}` : "Not signed in"}
      </p>
      <div className="mt-4">
        <AuthButtons />
      </div>
    </main>
  );
}
