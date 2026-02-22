"use client";

import { useState } from "react";
import { adminDeleteDealership } from "@/lib/actions/admin";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

type DealershipRow = {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  website: string | null;
  createdAt: Date;
  user: { name: string | null; email: string | null };
  _count: { vehicles: number };
};

export default function DealershipsAdminTable({
  dealerships,
}: {
  dealerships: DealershipRow[];
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await adminDeleteDealership(deleteId);
    setLoading(false);
    setDeleteId(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Vehicles</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dealerships.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs font-mono">
                    {d.slug}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block">{d.user.name || "—"}</span>
                  <span className="text-xs text-neutral-400">{d.user.email}</span>
                </TableCell>
                <TableCell>{d._count.vehicles}</TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {d.phone || "—"}
                </TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {new Date(d.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Dealership</DialogTitle>
            <DialogDescription>
              This will remove the dealership profile. Vehicle listings from this dealership will remain but lose their dealership association.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
