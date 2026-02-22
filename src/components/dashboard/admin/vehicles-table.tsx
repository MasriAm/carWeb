"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";

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
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Dealership</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id}>
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
                    <div className="h-10 w-14 bg-neutral-100 rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <span>{v.brand} {v.model}</span>
                  <span className="block text-xs text-neutral-400">{v.productionYear}</span>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="block">{v.user?.name || "—"}</span>
                  <span className="text-xs text-neutral-400">{v.user?.email}</span>
                </TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {v.dealership?.name || "—"}
                </TableCell>
                <TableCell>{v.price.toLocaleString()} JOD</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      v.status === "ON_SALE"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {v.status === "ON_SALE" ? "On Sale" : "Sold"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggle(v.id)}
                    title="Toggle status"
                  >
                    {v.status === "ON_SALE" ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Vehicle</DialogTitle>
            <DialogDescription>
              Permanently remove this vehicle listing from the platform.
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
