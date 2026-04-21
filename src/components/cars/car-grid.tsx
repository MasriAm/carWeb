"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { MarketplaceListVehicle } from "@/lib/actions/vehicles";
import CarCard from "./car-card";

type VehicleCard = MarketplaceListVehicle;

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function CarGrid({
  vehicles,
  savedIds,
  isLoggedIn,
}: {
  vehicles: VehicleCard[];
  savedIds: string[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {vehicles.map((v, i) => (
          <motion.div
            key={v.id}
            layout
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.3,
              delay: i * 0.04,
              layout: { type: "spring", stiffness: 300, damping: 30 },
            }}
          >
            <CarCard
              vehicle={v}
              isSaved={savedIds.includes(v.id)}
              isLoggedIn={isLoggedIn}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
