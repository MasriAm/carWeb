"use client";

import { useState } from "react";
import Image from "next/image";
import { deleteVehicle, updateVehicle } from "@/lib/actions/vehicles";
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

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  price: number;
  status: string;
  productionYear: number;
  imageUrls: string[];
  dealership?: { name: string } | null;
  _count: { savedBy: number };
};

export default function VehicleTable({ vehicles }: { vehicles: VehicleRow[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteVehicle(deleteId);
    setLoading(false);
    setDeleteId(null);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ON_SALE" ? "SOLD" : "ON_SALE";
    await updateVehicle(id, { status: newStatus as "ON_SALE" | "SOLD" });
  };

  return (
    <>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="w-16 text-zinc-400"></TableHead>
              <TableHead className="text-zinc-400">Vehicle</TableHead>
              <TableHead className="text-zinc-400">Price</TableHead>
              <TableHead className="text-zinc-400">Year</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Saves</TableHead>
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
                  {v.brand} {v.model}
                </TableCell>
                <TableCell className="text-zinc-300">{v.price.toLocaleString()} JOD</TableCell>
                <TableCell className="text-zinc-400">{v.productionYear}</TableCell>
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
                <TableCell className="text-zinc-400">{v._count.savedBy}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-zinc-700"
                    onClick={() => handleToggleStatus(v.id, v.status)}
                    title={v.status === "ON_SALE" ? "Mark as sold" : "Mark as on sale"}
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
              This action cannot be undone. The vehicle listing will be permanently removed.
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
