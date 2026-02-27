import Link from "next/link";
import { requireRole } from "@/lib/auth-utils";
import { getMyDealership, getDealerStats } from "@/lib/actions/dealership";
import DealershipForm from "@/components/dashboard/dealership-form";
import StatCard from "@/components/dashboard/stat-card";
import {
  Building2,
  Globe,
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Plus,
  UserCog,
  Car,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Dealership Profile" };

export default async function DealershipPage() {
  await requireRole(["DEALER", "ADMIN"]);
  const [dealership, stats] = await Promise.all([
    getMyDealership(),
    getDealerStats(),
  ]);

  if (!dealership) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Create Your Dealership</h1>
        <p className="text-zinc-400 mb-8">Set up your dealership to start listing vehicles.</p>
        <div className="max-w-2xl">
          <DealershipForm dealership={null} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Dealership</h1>
          <p className="text-zinc-500 mt-0.5 text-sm">Manage your dealership profile and view performance.</p>
        </div>
      </div>

      {/* ─── Bento Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {/* Profile Card — spans 2 cols */}
        <div className="md:col-span-2 rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg shadow-black/20">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 text-xl font-bold shadow-lg shadow-amber-500/20 shrink-0">
              {dealership.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">{dealership.name}</h2>
              <p className="text-sm text-zinc-500 mt-0.5 truncate">/{dealership.slug}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">Verified</span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {dealership.phone && (
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Phone className="h-4 w-4 text-zinc-600 shrink-0" />
                <span className="truncate">{dealership.phone}</span>
              </div>
            )}
            {dealership.whatsappNumber && (
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MessageCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="truncate">{dealership.whatsappNumber}</span>
              </div>
            )}
            {dealership.website && (
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <Globe className="h-4 w-4 text-zinc-600 shrink-0" />
                <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="truncate hover:text-amber-500 transition-colors">
                  {dealership.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {dealership.address && (
              <div className="flex items-center gap-2.5 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 text-zinc-600 shrink-0" />
                <span className="truncate">{dealership.address}</span>
              </div>
            )}
          </div>

          {dealership.description && (
            <p className="mt-4 text-sm text-zinc-500 leading-relaxed line-clamp-3 border-t border-zinc-800 pt-4">
              {dealership.description}
            </p>
          )}
        </div>

        {/* Quick Actions — spans 1 col on lg, 1 on md */}
        <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg shadow-black/20 flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-2.5 flex-1">
            <Link href="/dashboard/vehicles/new" className="flex-1">
              <Button variant="outline" className="w-full h-full min-h-[48px] justify-start gap-3 border-zinc-800 bg-zinc-800/30 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 rounded-xl transition-all">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Plus className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Add New Listing</p>
                  <p className="text-xs text-zinc-500">Create a vehicle listing</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/profile" className="flex-1">
              <Button variant="outline" className="w-full h-full min-h-[48px] justify-start gap-3 border-zinc-800 bg-zinc-800/30 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 rounded-xl transition-all">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <UserCog className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Update Profile</p>
                  <p className="text-xs text-zinc-500">Edit personal info</p>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/vehicles" className="flex-1">
              <Button variant="outline" className="w-full h-full min-h-[48px] justify-start gap-3 border-zinc-800 bg-zinc-800/30 text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 rounded-xl transition-all">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-4 w-4 text-amber-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">My Inventory</p>
                  <p className="text-xs text-zinc-500">Manage all listings</p>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Performance Stats — spans full row on lg (4 cols) */}
        <div className="md:col-span-3 lg:col-span-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Performance</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Listings" value={stats?.totalListings ?? 0} icon={<Car className="h-5 w-5" />} />
            <StatCard title="On Sale" value={stats?.onSale ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
            <StatCard title="Sold" value={stats?.sold ?? 0} icon={<ShieldCheck className="h-5 w-5" />} />
            <StatCard title="Total Saves" value={stats?.totalSaves ?? 0} icon={<Heart className="h-5 w-5" />} subtitle="Users saved your cars" />
          </div>
        </div>

        {/* Dealership Form — full width */}
        <div className="md:col-span-3 lg:col-span-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Edit Dealership</h3>
          <DealershipForm dealership={dealership} />
        </div>

      </div>
    </div>
  );
}
