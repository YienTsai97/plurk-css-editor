import { auth } from "@/auth";
import AuthButtons from "@/components/auth-buttons";
import ImageUploader from "@/components/controllers/ImageUploader";
import { requireAuth } from "@/services/auth.service";
import { getUserByEmail } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { success } = await requireAuth();

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
    return
  }

  const user = await getUserByEmail(session.user.email);
  if (!user.success || !user.data) {
    redirect("/auth/signin");
    return;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-3">
        <img src={user.data.image ?? ""} alt="" className="w-6 h-6 rounded-full" />
        <span className="text-sm">Welcome, {user.data.name ?? user.data.email}</span>
        <AuthButtons />
      </div>
      <ImageUploader isLoggingIn={success} />
    </div>
  );
}
