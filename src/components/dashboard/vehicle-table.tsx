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
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Saves</TableHead>
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
                  {v.brand} {v.model}
                </TableCell>
                <TableCell>{v.price.toLocaleString()} JOD</TableCell>
                <TableCell>{v.productionYear}</TableCell>
                <TableCell>
                  <Badge
                    variant={v.status === "ON_SALE" ? "default" : "secondary"}
                    className={
                      v.status === "ON_SALE"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {v.status === "ON_SALE" ? "On Sale" : "Sold"}
                  </Badge>
                </TableCell>
                <TableCell>{v._count.savedBy}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleStatus(v.id, v.status)}
                    title={v.status === "ON_SALE" ? "Mark as sold" : "Mark as on sale"}
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
              This action cannot be undone. The vehicle listing will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
