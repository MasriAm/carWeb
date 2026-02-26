"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  adminDeleteVehicle,
  adminToggleVehicleStatus,
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
import { Trash2, ToggleLeft, ToggleRight, Pencil } from "lucide-react";

type AdminVehicleRow = {
  id: string;
  brand: string;
  model: string;
  price: number;
  status: string;
  productionYear: number;
  imageUrls: string[];
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
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="w-16 text-zinc-400"></TableHead>
              <TableHead className="text-zinc-400">Vehicle</TableHead>
              <TableHead className="text-zinc-400">Owner</TableHead>
              <TableHead className="text-zinc-400">Dealership</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id} className="border-zinc-800 hover:bg-zinc-800/50">
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
                    <div className="h-10 w-14 bg-zinc-800 rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium text-zinc-200">
                  <span>{v.brand} {v.model}</span>
                  <span className="block text-xs text-zinc-500">{v.productionYear}</span>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block text-zinc-300">{v.user?.name || "—"}</span>
                  <span className="text-xs text-zinc-500">{v.user?.email}</span>
                </TableCell>
                <TableCell className="text-sm text-zinc-400">
                  {v.dealership?.name || "—"}
                </TableCell>
                <TableCell className="text-zinc-300">{v.price.toLocaleString()} JOD</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      v.status === "ON_SALE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }
                  >
                    {v.status === "ON_SALE" ? "On Sale" : "Sold"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Link href={`/dashboard/admin/vehicles/${v.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-zinc-700"
                      title="Edit vehicle"
                    >
                      <Pencil className="h-4 w-4 text-amber-500" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-700"
                    onClick={() => handleToggle(v.id)}
                    title="Toggle status"
                  >
                    {v.status === "ON_SALE" ? (
                      <ToggleRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-zinc-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-zinc-700"
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
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete Vehicle</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Permanently remove this vehicle listing from the platform.
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
