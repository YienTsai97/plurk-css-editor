import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p>Welcome, {session?.user?.name ?? session?.user?.email}</p>
    </main>
  );
}
