import { requireAuth } from "@/lib/auth-utils";
import ProfileForm from "@/components/dashboard/profile-form";

export const metadata = { title: "Profile Settings" };

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Profile Settings</h1>
      <p className="text-zinc-400 mb-8">Update your personal information.</p>
      <div className="max-w-lg">
        <ProfileForm
          initialName={user.name || ""}
          initialEmail={user.email || ""}
        />
      </div>
    </div>
  );
}
