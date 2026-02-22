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
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "DEALER":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-neutral-100 text-neutral-700 hover:bg-neutral-100";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Vehicles</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.name || "—"}
                </TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(v) => handleRoleChange(u.id, v)}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="DEALER">Dealer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{u._count.vehicles}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      u.isSuspended
                        ? "bg-red-100 text-red-700 hover:bg-red-100"
                        : "bg-green-100 text-green-700 hover:bg-green-100"
                    }
                  >
                    {u.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleSuspend(u.id)}
                    title={u.isSuspended ? "Unsuspend" : "Suspend"}
                  >
                    {u.isSuspended ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Ban className="h-4 w-4 text-orange-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This will permanently delete this user and all their data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
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
