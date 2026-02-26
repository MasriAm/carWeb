import { z } from "zod";

export const VehicleStatusEnum = z.enum(["ON_SALE", "SOLD"]);
export const ConditionEnum = z.enum(["NEW", "USED"]);
export const BodyTypeEnum = z.enum([
  "SUV",
  "SEDAN",
  "COUPE",
  "HATCHBACK",
  "CONVERTIBLE",
  "PICKUP",
  "VAN",
  "WAGON",
]);
export const TransmissionEnum = z.enum(["AUTO", "MANUAL"]);
export const FuelTypeEnum = z.enum(["GAS", "ELECTRIC", "DIESEL", "HYBRID"]);
export const OriginSpecEnum = z.enum([
  "EUROPEAN",
  "CHINESE",
  "JORDANIAN",
  "AMERICAN",
  "GULF",
]);

export const createVehicleSchema = z.object({
  dealershipId: z.string().cuid().optional(),

  videoUrl: z.string().url().optional().or(z.literal("")),
  imageUrls: z
    .array(z.string().url())
    .min(1, "At least one image is required"),

  brand: z.string().min(1, "Brand is required").max(50),
  model: z.string().min(1, "Model is required").max(100),
  price: z
    .number()
    .int()
    .positive("Price must be positive")
    .max(10_000_000, "Price seems unrealistic"),
  shortDescription: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),

  condition: ConditionEnum,
  bodyType: BodyTypeEnum,
  seats: z.number().int().min(1).max(12),
  transmission: TransmissionEnum,
  engineCapacityCC: z.number().int().min(0).max(15000),
  fuelType: FuelTypeEnum,
  mileageKm: z.number().int().min(0),
  originSpec: OriginSpecEnum,
  productionYear: z
    .number()
    .int()
    .min(1970)
    .max(new Date().getFullYear() + 1),

  detailedSpecs: z.array(z.string()).optional().default([]),

  specificWhatsapp: z.string().max(20).optional().or(z.literal("")),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: VehicleStatusEnum.optional(),
});

export const vehicleFilterSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  condition: ConditionEnum.optional(),
  bodyType: BodyTypeEnum.optional(),
  transmission: TransmissionEnum.optional(),
  fuelType: FuelTypeEnum.optional(),
  originSpec: OriginSpecEnum.optional(),
  status: VehicleStatusEnum.optional(),
  minYear: z.coerce.number().int().min(1970).optional(),
  maxYear: z.coerce.number().int().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "year_desc", "year_asc", "newest"])
    .optional()
    .default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleFilterInput = z.infer<typeof vehicleFilterSchema>;
