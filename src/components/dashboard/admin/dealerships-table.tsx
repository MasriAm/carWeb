"use client";

import { useState } from "react";
import {
  adminDeleteDealership,
  adminUpdateDealership,
  adminResetDealerPassword,
} from "@/lib/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Pencil, KeyRound } from "lucide-react";

type DealershipRow = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  website: string | null;
  address: string | null;
  description: string | null;
  whatsappNumber: string | null;
  userId: string;
  createdAt: Date;
  user: { name: string | null; email: string | null };
  _count: { vehicles: number };
};

const inputCls = "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500";
const labelCls = "text-zinc-300 text-sm";

export default function DealershipsAdminTable({
  dealerships,
}: {
  dealerships: DealershipRow[];
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editDealership, setEditDealership] = useState<DealershipRow | null>(null);
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [resetUserName, setResetUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await adminDeleteDealership(deleteId);
    setLoading(false);
    setDeleteId(null);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editDealership) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await adminUpdateDealership(editDealership.id, {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      phone: (form.get("phone") as string) || undefined,
      website: (form.get("website") as string) || undefined,
      address: (form.get("address") as string) || undefined,
      whatsappNumber: (form.get("whatsappNumber") as string) || undefined,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }
    setEditDealership(null);
  };

  const handleResetPassword = async () => {
    if (!resetUserId) return;
    setLoading(true);
    setError("");

    const result = await adminResetDealerPassword(resetUserId, newPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.error || "Something went wrong");
      return;
    }
    setResetUserId(null);
    setNewPassword("");
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Slug</TableHead>
              <TableHead className="text-zinc-400">Owner</TableHead>
              <TableHead className="text-zinc-400">Vehicles</TableHead>
              <TableHead className="text-zinc-400">Phone</TableHead>
              <TableHead className="text-zinc-400">Created</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealerships.map((d) => (
              <TableRow key={d.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-medium text-zinc-200">{d.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs font-mono bg-zinc-800 text-zinc-300 border-zinc-700">
                    {d.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block text-zinc-300">{d.user.name || "—"}</span>
                  <span className="text-xs text-zinc-500">{d.user.email}</span>
                </TableCell>
                <TableCell className="text-zinc-400">{d._count.vehicles}</TableCell>
                <TableCell className="text-sm text-zinc-400">{d.phone || "—"}</TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {new Date(d.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-700"
                    onClick={() => { setEditDealership(d); setError(""); }}
                    title="Edit dealership"
                  >
                    <Pencil className="h-4 w-4 text-amber-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-700"
                    onClick={() => { setResetUserId(d.userId); setResetUserName(d.user.name || d.user.email || ""); setError(""); setNewPassword(""); }}
                    title="Reset dealer password"
                  >
                    <KeyRound className="h-4 w-4 text-blue-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-zinc-700"
                    onClick={() => setDeleteId(d.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Dealership</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will remove the dealership profile. Vehicle listings will remain but lose their dealership association.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDealership} onOpenChange={() => setEditDealership(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Edit Dealership</DialogTitle>
          </DialogHeader>
          {error && (
            <div className="rounded-lg px-3 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
          )}
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className={labelCls}>Name</Label>
                <Input name="name" defaultValue={editDealership?.name ?? ""} required className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className={labelCls}>Slug</Label>
                <Input name="slug" defaultValue={editDealership?.slug ?? ""} required className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className={labelCls}>Phone</Label>
                <Input name="phone" defaultValue={editDealership?.phone ?? ""} className={inputCls} />
              </div>
              <div className="space-y-1">
                <Label className={labelCls}>WhatsApp</Label>
                <Input name="whatsappNumber" defaultValue={editDealership?.whatsappNumber ?? ""} className={inputCls} />
              </div>
            </div>
            <div className="space-y-1">
              <Label className={labelCls}>Website</Label>
              <Input name="website" defaultValue={editDealership?.website ?? ""} className={inputCls} />
            </div>
            <div className="space-y-1">
              <Label className={labelCls}>Address</Label>
              <Input name="address" defaultValue={editDealership?.address ?? ""} className={inputCls} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDealership(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetUserId} onOpenChange={() => { setResetUserId(null); setNewPassword(""); setError(""); }}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Reset Password</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Set a new password for <span className="font-medium text-zinc-200">{resetUserName}</span>
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg px-3 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-400">{error}</div>
          )}
          <div className="space-y-2">
            <Label className={labelCls}>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
              className={inputCls}
              minLength={6}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setResetUserId(null); setNewPassword(""); }} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={loading || newPassword.length < 6} className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
