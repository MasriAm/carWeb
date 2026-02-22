import { requireAuth } from "@/lib/auth-utils";
import { getDealerStats } from "@/lib/actions/dealership";
import { getAdminStats } from "@/lib/actions/admin";
import { db } from "@/lib/db";
import StatCard from "@/components/dashboard/stat-card";
import { Car, Heart, TrendingUp, Users, Building2, ShieldCheck } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "ADMIN") {
    const stats = await getAdminStats();
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Admin Overview</h1>
        <p className="text-neutral-500 mb-8">Platform-wide statistics at a glance.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Users" value={stats.users} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Total Vehicles" value={stats.vehicles} icon={<Car className="h-5 w-5" />} />
          <StatCard title="Dealerships" value={stats.dealerships} icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="On Sale" value={stats.onSale} icon={<TrendingUp className="h-5 w-5" />} subtitle="Active listings" />
          <StatCard title="Sold" value={stats.sold} icon={<ShieldCheck className="h-5 w-5" />} subtitle="Completed sales" />
        </div>
      </div>
    );
  }

  if (user.role === "DEALER") {
    const stats = await getDealerStats();
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Dealer Dashboard</h1>
        <p className="text-neutral-500 mb-8">Your dealership performance.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Listings" value={stats?.totalListings ?? 0} icon={<Car className="h-5 w-5" />} />
          <StatCard title="On Sale" value={stats?.onSale ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard title="Sold" value={stats?.sold ?? 0} icon={<ShieldCheck className="h-5 w-5" />} />
          <StatCard title="Total Saves" value={stats?.totalSaves ?? 0} icon={<Heart className="h-5 w-5" />} subtitle="Users saved your cars" />
        </div>
      </div>
    );
  }

  const savedCount = await db.savedVehicle.count({
    where: { userId: user.id },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-1">
        Welcome back, {user.name || "User"}
      </h1>
      <p className="text-neutral-500 mb-8">Your personal dashboard.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard title="Saved Cars" value={savedCount} icon={<Heart className="h-5 w-5" />} subtitle="Vehicles in your wishlist" />
      </div>
    </div>
  );
}
