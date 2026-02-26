import { requireRole } from "@/lib/auth-utils";
import { getAllUsers } from "@/lib/actions/admin";
import UsersAdminTable from "@/components/dashboard/admin/users-table";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">All Users</h1>
      <p className="text-zinc-400 mb-8">
        {users.length} registered user{users.length !== 1 ? "s" : ""}.
      </p>
      <UsersAdminTable users={users} />
    </div>
  );
}
