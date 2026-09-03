"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  adminDeleteVehicle,
  adminToggleVehicleStatus,
  adminTogglePromoted,
} from "@/lib/actions/admin";
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
import { Trash2, ToggleLeft, ToggleRight, Pencil, Star } from "lucide-react";

type AdminVehicleRow = {
  id: string;
  brand: string;
  model: string;
  price: number;
  status: string;
  productionYear: number;
  imageUrls: string[];
  isPromoted: boolean;
  user: { name: string | null; email: string | null } | null;
  dealership: { name: string } | null;
};

export default function AdminVehicleTable({
  vehicles,
}: {
  vehicles: AdminVehicleRow[];
}) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await adminDeleteVehicle(deleteId);
    setLoading(false);
    setDeleteId(null);
  };

  const handleToggle = async (id: string) => {
    await adminToggleVehicleStatus(id);
  };

  return (
    <>
      <div className="bg-surface rounded-xl border border-line overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-line hover:bg-surface">
              <TableHead className="w-16 text-ink-3"></TableHead>
              <TableHead className="text-ink-3">Vehicle</TableHead>
              <TableHead className="text-ink-3">Owner</TableHead>
              <TableHead className="text-ink-3">Dealership</TableHead>
              <TableHead className="text-ink-3">Price</TableHead>
              <TableHead className="text-ink-3">Status</TableHead>
              <TableHead className="text-right text-ink-3">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id} className="border-line hover:bg-surface-2/50">
                <TableCell>
                  {v.imageUrls[0] ? (
                    <div className="h-10 w-14 relative rounded overflow-hidden">
                      <Image
                        src={v.imageUrls[0]}
                        alt={`${v.brand} ${v.model}`}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-14 bg-surface-2 rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-ink-2">
                  <span>{v.brand} {v.model}</span>
                  <span className="block text-xs text-ink-3">{v.productionYear}</span>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block text-ink-2">{v.user?.name || "—"}</span>
                  <span className="text-xs text-ink-3">{v.user?.email}</span>
                </TableCell>
                <TableCell className="text-sm text-ink-3">
                  {v.dealership?.name || "—"}
                </TableCell>
                <TableCell className="text-ink-2">{v.price.toLocaleString()} JOD</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      v.status === "ON_SALE"
                        ? "bg-trust-soft text-trust border-trust/25"
                        : "bg-danger-soft text-danger border-danger/25"
                    }
                  >
                    {v.status === "ON_SALE" ? "On Sale" : "Sold"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-surface-3"
                    onClick={() => adminTogglePromoted(v.id)}
                    title={v.isPromoted ? "Remove promotion" : "Promote listing"}
                  >
                    <Star className={`h-4 w-4 ${v.isPromoted ? "fill-brand text-brand-strong" : "text-ink-3"}`} />
                  </Button>
                  <Link href={`/dashboard/admin/vehicles/${v.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-surface-3"
                      title="Edit vehicle"
                    >
                      <Pencil className="h-4 w-4 text-brand-strong" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-surface-3"
                    onClick={() => handleToggle(v.id)}
                    title="Toggle status"
                  >
                    {v.status === "ON_SALE" ? (
                      <ToggleRight className="h-4 w-4 text-trust" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-ink-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-danger hover:text-danger hover:bg-surface-3"
                    onClick={() => setDeleteId(v.id)}
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
            <DialogTitle className="text-ink">Delete Vehicle</DialogTitle>
            <DialogDescription className="text-ink-3">
              Permanently remove this vehicle listing from the platform.
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
    </>
  );
}
