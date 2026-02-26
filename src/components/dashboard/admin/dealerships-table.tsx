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
                <TableCell className="text-sm text-zinc-400">
                  {d.phone || "—"}
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {new Date(d.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Dealership</DialogTitle>
            <DialogDescription className="text-zinc-400">
              This will remove the dealership profile. Vehicle listings from this dealership will remain but lose their dealership association.
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
    </>
  );
}
