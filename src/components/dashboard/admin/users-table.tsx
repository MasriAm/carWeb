"use client";

import { useState } from "react";
import {
  updateUserRole,
  toggleSuspendUser,
  deleteUser,
} from "@/lib/actions/admin";
import type { Role } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Ban, CheckCircle } from "lucide-react";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role;
  isSuspended: boolean;
  createdAt: Date;
  phone: string | null;
  _count: { vehicles: number };
};

export default function UsersAdminTable({ users }: { users: UserRow[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role as Role);
  };

  const handleToggleSuspend = async (userId: string) => {
    await toggleSuspendUser(userId);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteUser(deleteId);
    setLoading(false);
    setDeleteId(null);
  };

  const roleBadgeColor = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DEALER":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-zinc-700 text-zinc-300";
    }
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Email</TableHead>
              <TableHead className="text-zinc-400">Role</TableHead>
              <TableHead className="text-zinc-400">Vehicles</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Joined</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">
                  {u.name || "—"}
                </TableCell>
                <TableCell className="text-sm text-zinc-400">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(v) => handleRoleChange(u.id, v)}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="DEALER">Dealer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-zinc-400">{u._count.vehicles}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      u.isSuspended
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }
                  >
                    {u.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-700"
                    onClick={() => handleToggleSuspend(u.id)}
                    title={u.isSuspended ? "Unsuspend" : "Suspend"}
                  >
                    {u.isSuspended ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Ban className="h-4 w-4 text-orange-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-zinc-700"
                    onClick={() => setDeleteId(u.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete User</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will permanently delete this user and all their data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
