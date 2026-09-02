import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import ProfileForm from "@/components/dashboard/profile-form";

export const metadata = { title: "Profile settings" };

export default async function ProfilePage() {
  const user = await requireAuth();
  const record = await db.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true, phone: true },
  });

  return (
    <div>
      <h1 className="text-h2 font-bold text-ink">Profile settings</h1>
      <p className="mt-1 text-body-sm text-ink-3">
        Update your personal information.
      </p>
      <div className="mt-8 max-w-lg">
        <ProfileForm
          initialName={record?.name ?? ""}
          initialEmail={record?.email ?? ""}
          initialPhone={record?.phone ?? ""}
        />
      </div>
    </div>
  );
}
