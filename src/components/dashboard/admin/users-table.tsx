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

  return (
    <>
      <div className="bg-surface rounded-xl border border-line overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-surface">
              <TableHead className="text-ink-3">Name</TableHead>
              <TableHead className="text-ink-3">Email</TableHead>
              <TableHead className="text-ink-3">Role</TableHead>
              <TableHead className="text-ink-3">Vehicles</TableHead>
              <TableHead className="text-ink-3">Status</TableHead>
              <TableHead className="text-ink-3">Joined</TableHead>
              <TableHead className="text-right text-ink-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-line hover:bg-surface-2/50">
                <TableCell className="font-medium text-ink-2">
                  {u.name || "—"}
                </TableCell>
                <TableCell className="text-sm text-ink-3">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Select
                    value={u.role}
                    onValueChange={(v) => handleRoleChange(u.id, v)}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs bg-surface-2 border-line-control text-ink-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface border-line-control">
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="DEALER">Dealer</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-ink-3">{u._count.vehicles}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      u.isSuspended
                        ? "bg-danger-soft text-danger border-danger/25"
                        : "bg-trust-soft text-trust border-trust/25"
                    }
                  >
                    {u.isSuspended ? "Suspended" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-ink-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-surface-3"
                    onClick={() => handleToggleSuspend(u.id)}
                    title={u.isSuspended ? "Unsuspend" : "Suspend"}
                  >
                    {u.isSuspended ? (
                      <CheckCircle className="h-4 w-4 text-trust" />
                    ) : (
                      <Ban className="h-4 w-4 text-warn" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger hover:text-danger hover:bg-surface-3"
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
        <DialogContent className="bg-surface border-line">
          <DialogHeader>
            <DialogTitle className="text-ink">Delete User</DialogTitle>
            <DialogDescription className="text-ink-3">
              This will permanently delete this user and all their data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-line-control text-ink-2 hover:bg-surface-2">
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
