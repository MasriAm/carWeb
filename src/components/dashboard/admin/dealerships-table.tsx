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

const inputCls = "bg-surface-2 border-line-control text-ink placeholder:text-ink-3";
const labelCls = "text-ink-2 text-sm";

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
      <div className="bg-surface rounded-xl border border-line overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-surface">
              <TableHead className="text-ink-3">Name</TableHead>
              <TableHead className="text-ink-3">Slug</TableHead>
              <TableHead className="text-ink-3">Owner</TableHead>
              <TableHead className="text-ink-3">Vehicles</TableHead>
              <TableHead className="text-ink-3">Phone</TableHead>
              <TableHead className="text-ink-3">Created</TableHead>
              <TableHead className="text-right text-ink-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealerships.map((d) => (
              <TableRow key={d.id} className="border-line hover:bg-surface-2/50">
                <TableCell className="font-medium text-ink-2">{d.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs font-mono bg-surface-2 text-ink-2 border-line-control">
                    {d.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block text-ink-2">{d.user.name || "—"}</span>
                  <span className="text-xs text-ink-3">{d.user.email}</span>
                </TableCell>
                <TableCell className="text-ink-3">{d._count.vehicles}</TableCell>
                <TableCell className="text-sm text-ink-3">{d.phone || "—"}</TableCell>
                <TableCell className="text-sm text-ink-3">
                  {new Date(d.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-surface-3"
                    onClick={() => { setEditDealership(d); setError(""); }}
                    title="Edit dealership"
                  >
                    <Pencil className="h-4 w-4 text-brand-strong" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-surface-3"
                    onClick={() => { setResetUserId(d.userId); setResetUserName(d.user.name || d.user.email || ""); setError(""); setNewPassword(""); }}
                    title="Reset dealer password"
                  >
                    <KeyRound className="h-4 w-4 text-ink-2" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger hover:text-danger hover:bg-surface-3"
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
        <DialogContent className="bg-surface border-line">
          <DialogHeader>
            <DialogTitle className="text-ink">Delete Dealership</DialogTitle>
            <DialogDescription className="text-ink-3">
              This will remove the dealership profile. Vehicle listings will remain but lose their dealership association.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-line-control text-ink-2 hover:bg-surface-2">
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
        <DialogContent className="bg-surface border-line max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-ink">Edit Dealership</DialogTitle>
          </DialogHeader>
          {error && (
            <div className="rounded-lg px-3 py-2 text-sm bg-danger-soft border border-danger/25 text-danger">{error}</div>
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
              <Button type="button" variant="outline" onClick={() => setEditDealership(null)} className="border-line-control text-ink-2 hover:bg-surface-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-brand text-brand-ink hover:bg-brand-hover">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetUserId} onOpenChange={() => { setResetUserId(null); setNewPassword(""); setError(""); }}>
        <DialogContent className="bg-surface border-line max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-ink">Reset Password</DialogTitle>
            <DialogDescription className="text-ink-3">
              Set a new password for <span className="font-medium text-ink-2">{resetUserName}</span>
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="rounded-lg px-3 py-2 text-sm bg-danger-soft border border-danger/25 text-danger">{error}</div>
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
            <Button variant="outline" onClick={() => { setResetUserId(null); setNewPassword(""); }} className="border-line-control text-ink-2 hover:bg-surface-2">
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={loading || newPassword.length < 6} className="bg-brand text-brand-ink hover:bg-brand-hover">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
