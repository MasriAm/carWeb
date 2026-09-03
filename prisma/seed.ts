import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({
  adapter,
}) as InstanceType<typeof PrismaClient>;

import photoOverrides from "./seed-photos.json";

/**
 * Photos for seeded listings.
 *
 * Stock photography cannot be verified from a sandbox with no image egress,
 * and an unverified photo is worse than none — an earlier revision of this
 * file put a BMW on the Civic and a stock portrait of a person on the Golf.
 * So a listing shows its own photos only when someone has looked at them and
 * put them in seed-photos.json; otherwise it gets the silhouette for its body
 * type, which is always right about what kind of vehicle it is.
 */
function photosFor(brand: string, model: string, bodyType: string): string[] {
  const key = `${brand} ${model}`;
  const given = (photoOverrides as Record<string, unknown>)[key];
  if (Array.isArray(given) && given.length > 0) return given as string[];
  return [`/placeholder/${bodyType.toLowerCase()}.png`];
}

const PLACEHOLDER_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";
const PLACEHOLDER_VIDEO_2 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Cleanup ──────────────────────────────────────────────────
  await prisma.savedVehicle.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.dealership.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("  ✓ Cleared existing data");

  // ── Users ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Royal",
      email: "admin@royalcars.jo",
      password: hashedPassword,
      phone: "+962790000001",
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  });
  console.log(`  ✓ Created ADMIN: ${admin.email}`);

  const dealer = await prisma.user.create({
    data: {
      name: "Ahmad Mansour",
      email: "dealer@ammanluxury.jo",
      password: hashedPassword,
      phone: "+962791000002",
      role: "DEALER",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  });
  console.log(`  ✓ Created DEALER: ${dealer.email}`);

  const user = await prisma.user.create({
    data: {
      name: "Sara Khalil",
      email: "sara@gmail.com",
      password: hashedPassword,
      phone: "+962799000003",
      role: "USER",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
  });
  console.log(`  ✓ Created USER: ${user.email}`);

  // ── Dealership ───────────────────────────────────────────────
  const dealership = await prisma.dealership.create({
    data: {
      name: "Amman Luxury Motors",
      slug: "amman-luxury-motors",
      description:
        "Jordan's premier destination for luxury and performance vehicles. Located in the heart of Abdoun, we specialize in European and Gulf-spec imports with full inspection reports.",
      logoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
      address: "23 Abdoun Circle, Amman, Jordan",
      phone: "+962 6 593 1000",
      website: "https://ammanluxurymotors.jo",
      userId: dealer.id,
    },
  });
  console.log(`  ✓ Created Dealership: ${dealership.name}\n`);

  const dealer2 = await prisma.user.create({
    data: {
      name: "Rami Odeh",
      email: "rami@wadisaqramotors.jo",
      password: hashedPassword,
      phone: "+962799000004",
      role: "DEALER",
    },
  });
  console.log(`  ✓ Created DEALER: ${dealer2.email}`);

  const dealership2 = await prisma.dealership.create({
    data: {
      name: "Wadi Saqra Motors",
      slug: "wadi-saqra-motors",
      description:
        "Family-run showroom on Wadi Saqra Street since 2004. Mostly Korean and Japanese cars for everyday budgets, plus US-spec imports we buy and prepare ourselves.",
      logoUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&h=200&fit=crop",
      address: "Wadi Saqra Street, Amman, Jordan",
      phone: "+962 6 464 2200",
      userId: dealer2.id,
    },
  });
  console.log(`  ✓ Created Dealership: ${dealership2.name}\n`);

  // ── Vehicles ─────────────────────────────────────────────────
  const vehicles = [
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      videoUrl: PLACEHOLDER_VIDEO,
      imageUrls: [
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80",
        "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
        "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
      ],
      brand: "Mercedes-Benz",
      model: "G63 AMG",
      price: 115000,
      shortDescription:
        "Mercedes G63 AMG 2023 — Gulf spec, matte black finish, twin-turbo V8, full carbon fiber package, immaculate condition.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 3982,
      fuelType: "GAS" as const,
      mileageKm: 12500,
      productionYear: 2023,
      fa7s: "Full inspection — no accidents, original paint, all systems operational.",
      waredWakaleh: true,
      specOrigin: "GCC" as const,
      isPromoted: true,
      detailedSpecs: [
        "360° Camera System",
        "Adaptive Cruise Control",
        "Burmester Surround Sound",
        "AMG Performance Exhaust",
        "Carbon Fiber Interior Trim",
        "Night Package",
        "Heated & Ventilated Seats",
        "Head-Up Display",
        "Wireless Charging",
        "Rear Entertainment System",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      videoUrl: PLACEHOLDER_VIDEO_2,
      imageUrls: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
        "https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=800&q=80",
        "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
      ],
      brand: "BMW",
      model: "M4 Competition",
      price: 62000,
      shortDescription:
        "BMW M4 Competition 2024 — European spec, Isle of Man Green, xDrive, M Carbon bucket seats, pristine showroom condition.",
      condition: "NEW" as const,
      bodyType: "COUPE" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 2993,
      fuelType: "GAS" as const,
      mileageKm: 350,
      productionYear: 2024,
      waredWakaleh: false,
      specOrigin: "EU" as const,
      isPromoted: false,
      detailedSpecs: [
        "M Carbon Ceramic Brakes",
        "M Carbon Bucket Seats",
        "Harman Kardon Surround",
        "Adaptive M Suspension",
        "M Drive Professional",
        "Laser Headlights",
        "Parking Assistant Plus",
        "Live Cockpit Professional",
        "Collision Warning with Braking",
        "Lane Departure Warning",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
        "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
        "https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80",
        "https://images.unsplash.com/photo-1611859266785-fcbee73cf957?w=800&q=80",
      ],
      brand: "Porsche",
      model: "Macan S",
      price: 78000,
      shortDescription:
        "Porsche Macan S 2024 — European spec, Carrara White Metallic, sport exhaust, panoramic roof, like-new.",
      condition: "NEW" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 2894,
      fuelType: "GAS" as const,
      mileageKm: 800,
      productionYear: 2024,
      waredWakaleh: true,
      specOrigin: "EU" as const,
      isPromoted: false,
      detailedSpecs: [
        "Porsche Active Suspension Management",
        "Sport Chrono Package",
        "Panoramic Roof System",
        "Bose Surround Sound",
        "Lane Keep Assist",
        "Adaptive Cruise Control",
        "360° Surround View",
        "14-Way Power Seats",
        "Porsche Communication Management",
        "Matrix LED Headlights",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "SOLD" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
        "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80",
        "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80",
      ],
      brand: "Toyota",
      model: "Camry Hybrid",
      price: 28500,
      shortDescription:
        "Toyota Camry Hybrid 2022 — Jordanian spec, silver metallic, excellent fuel economy, dealer-maintained full service history.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 2487,
      fuelType: "HYBRID" as const,
      mileageKm: 34000,
      productionYear: 2022,
      waredWakaleh: true,
      specOrigin: "GCC" as const,
      isPromoted: false,
      detailedSpecs: [
        "Toyota Safety Sense 2.5",
        "Pre-Collision System",
        "Dynamic Radar Cruise Control",
        "Lane Tracing Assist",
        "Blind Spot Monitor",
        "Rear Cross-Traffic Alert",
        "JBL Audio System",
        "Wireless Apple CarPlay",
        "Dual Zone Climate Control",
      ],
    },
    {
      userId: user.id,
      status: "ON_SALE" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
      ],
      brand: "Range Rover",
      model: "Sport HSE",
      price: 95000,
      shortDescription:
        "Range Rover Sport HSE 2023 — Gulf spec, Santorini Black, air suspension, Meridian sound, single owner.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 2997,
      fuelType: "DIESEL" as const,
      mileageKm: 18000,
      productionYear: 2023,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: false,
      detailedSpecs: [
        "Terrain Response 2",
        "Meridian Signature Sound",
        "Electronic Air Suspension",
        "Pixel LED Headlights",
        "Wade Sensing",
        "Activity Key",
        "Gesture Tailgate",
        "Head-Up Display",
        "ClearSight Interior Mirror",
        "Cabin Air Ionisation",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
        "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80",
        "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
        "https://images.unsplash.com/photo-1619682817481-e994891cd1f6?w=800&q=80",
      ],
      brand: "Audi",
      model: "RS6 Avant",
      price: 105000,
      shortDescription:
        "Audi RS6 Avant 2023 — European spec, Nardo Grey, ceramic brakes, Black Optic package, one of a kind in Jordan.",
      condition: "USED" as const,
      bodyType: "WAGON" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 3996,
      fuelType: "GAS" as const,
      mileageKm: 9200,
      productionYear: 2023,
      waredWakaleh: false,
      specOrigin: "EU" as const,
      isPromoted: true,
      detailedSpecs: [
        "RS Ceramic Brakes",
        "RS Sport Suspension Plus",
        "Bang & Olufsen 3D Sound",
        "Black Optic Package",
        "Matrix LED with Laser",
        "Night Vision Assistant",
        "Adaptive Cruise with Stop & Go",
        "RS Design Package",
        "Sport Differential",
        "Carbon Engine Cover",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
        "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
        "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
      ],
      brand: "Toyota",
      model: "Land Cruiser 300",
      price: 72000,
      shortDescription:
        "Toyota Land Cruiser 300 GR Sport 2023 — Gulf spec, pearl white, V6 twin-turbo, factory armoured glass option.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 3346,
      fuelType: "DIESEL" as const,
      mileageKm: 21000,
      productionYear: 2023,
      waredWakaleh: true,
      specOrigin: "GCC" as const,
      isPromoted: false,
      detailedSpecs: [
        "Multi-Terrain Select",
        "Crawl Control",
        "E-KDSS Suspension",
        "14-Speaker JBL System",
        "Fingerprint Start",
        "Rear Differential Lock",
        "Toyota Safety Sense",
        "360° Camera",
        "Wireless Charging",
        "Cool Box",
      ],
    },
    {
      userId: user.id,
      status: "ON_SALE" as const,
      imageUrls: [
        "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80",
        "https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&q=80",
        "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80",
      ],
      brand: "Kia",
      model: "EV6 GT-Line",
      price: 38000,
      shortDescription:
        "Kia EV6 GT-Line 2024 — Yacht Blue, 77.4kWh battery, 800V ultra-fast charging, excellent range.",
      condition: "NEW" as const,
      bodyType: "HATCHBACK" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 1200,
      productionYear: 2024,
      waredWakaleh: true,
      specOrigin: "KOREAN" as const,
      isPromoted: false,
      detailedSpecs: [
        "800V Ultra-Fast Charging",
        "Vehicle-to-Load (V2L)",
        "Augmented Reality HUD",
        "Meridian Premium Audio",
        "Highway Driving Assist 2",
        "Remote Smart Parking",
        "Relaxation Comfort Seats",
        "Digital Side Mirrors",
        "Over-the-Air Updates",
        "Regenerative Braking System",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Hyundai",
      model: "Elantra",
      price: 11500,
      shortDescription:
        "Hyundai Elantra 2019 — American spec, imported and fully prepared, clean title, new tyres and brakes.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1999,
      fuelType: "GAS" as const,
      mileageKm: 78000,
      productionYear: 2019,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: false,
      detailedSpecs: [
        "Apple CarPlay",
        "Rear Camera",
        "Cruise Control",
        "Alloy Wheels",
        "Bluetooth",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Kia",
      model: "Rio",
      price: 9800,
      shortDescription:
        "Kia Rio 2020 — Korean spec, single owner, economical on fuel, ideal first car.",
      condition: "USED" as const,
      bodyType: "HATCHBACK" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1368,
      fuelType: "GAS" as const,
      mileageKm: 52000,
      productionYear: 2020,
      waredWakaleh: false,
      specOrigin: "KOREAN" as const,
      isPromoted: false,
      detailedSpecs: [
        "Touchscreen Infotainment",
        "Rear Sensors",
        "Electric Windows",
        "ISOFIX Anchors",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Toyota",
      model: "Corolla",
      price: 14900,
      shortDescription:
        "Toyota Corolla Hybrid 2021 — وارد وكالة, full agency service history, extremely low running costs.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1798,
      fuelType: "HYBRID" as const,
      mileageKm: 41000,
      productionYear: 2021,
      waredWakaleh: true,
      specOrigin: "GCC" as const,
      isPromoted: false,
      detailedSpecs: [
        "Hybrid Synergy Drive",
        "Lane Departure Alert",
        "Adaptive Cruise Control",
        "Apple CarPlay",
        "Rear Camera",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Nissan",
      model: "Sunny",
      price: 7600,
      shortDescription:
        "Nissan Sunny 2018 — Gulf spec, well maintained, spacious rear seats, cheap to insure and service.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1498,
      fuelType: "GAS" as const,
      mileageKm: 96000,
      productionYear: 2018,
      waredWakaleh: false,
      specOrigin: "GCC" as const,
      isPromoted: false,
      detailedSpecs: [
        "Air Conditioning",
        "Bluetooth",
        "Rear Camera",
        "Power Steering",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Hyundai",
      model: "Tucson",
      price: 21500,
      shortDescription:
        "Hyundai Tucson 2022 — وارد وكالة, panoramic roof, still under agency warranty.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1598,
      fuelType: "GAS" as const,
      mileageKm: 28000,
      productionYear: 2022,
      waredWakaleh: true,
      specOrigin: "KOREAN" as const,
      isPromoted: true,
      detailedSpecs: [
        "Panoramic Sunroof",
        "Blind Spot Monitor",
        "Wireless Charging",
        "Digital Cluster",
        "Heated Seats",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Kia",
      model: "Sportage",
      price: 19750,
      shortDescription:
        "Kia Sportage Hybrid 2021 — Korean spec, one owner, full service book, excellent condition throughout.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1598,
      fuelType: "HYBRID" as const,
      mileageKm: 35000,
      productionYear: 2021,
      waredWakaleh: false,
      specOrigin: "KOREAN" as const,
      isPromoted: false,
      detailedSpecs: [
        "Hybrid Powertrain",
        "360° Camera",
        "Powered Tailgate",
        "Dual-Zone Climate",
        "Harman Kardon Audio",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Mitsubishi",
      model: "Lancer",
      price: 8200,
      shortDescription:
        "Mitsubishi Lancer 2017 — Japanese spec, high mileage but mechanically sound, recent timing service.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1598,
      fuelType: "GAS" as const,
      mileageKm: 118000,
      productionYear: 2017,
      waredWakaleh: false,
      specOrigin: "JAPANESE" as const,
      isPromoted: false,
      detailedSpecs: [
        "Air Conditioning",
        "Alloy Wheels",
        "Bluetooth",
        "Fog Lights",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Chevrolet",
      model: "Malibu",
      price: 10900,
      shortDescription:
        "Chevrolet Malibu 2019 — American spec import, repaired and inspected in our workshop, report available.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1490,
      fuelType: "GAS" as const,
      mileageKm: 84000,
      productionYear: 2019,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: false,
      detailedSpecs: [
        "Apple CarPlay",
        "Rear Camera",
        "Keyless Entry",
        "Alloy Wheels",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Tesla",
      model: "Model 3",
      price: 27500,
      shortDescription:
        "Tesla Model 3 Long Range 2022 — American spec, dual motor, roughly 500 km of real range, free charging at home setup included.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 33000,
      productionYear: 2022,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: true,
      detailedSpecs: [
        "Autopilot",
        "Dual Motor AWD",
        "Glass Roof",
        "Over-the-Air Updates",
        "Premium Audio",
        "Heated Seats",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "MG",
      model: "ZS EV",
      price: 18900,
      shortDescription:
        "MG ZS EV 2023 — وارد وكالة, low mileage, remaining battery warranty transfers to the new owner.",
      condition: "USED" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 12000,
      productionYear: 2023,
      waredWakaleh: true,
      specOrigin: "OTHER" as const,
      isPromoted: false,
      detailedSpecs: [
        "Electric Drivetrain",
        "Panoramic Roof",
        "360° Camera",
        "Adaptive Cruise Control",
        "Fast Charging",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Hyundai",
      model: "Ioniq 5",
      price: 29900,
      shortDescription:
        "Hyundai Ioniq 5 2023 — وارد وكالة, 800V architecture charges 10–80% in under twenty minutes.",
      condition: "USED" as const,
      bodyType: "HATCHBACK" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 15000,
      productionYear: 2023,
      waredWakaleh: true,
      specOrigin: "KOREAN" as const,
      isPromoted: true,
      detailedSpecs: [
        "800V Fast Charging",
        "Vehicle-to-Load",
        "Digital Side Mirrors",
        "Highway Driving Assist",
        "Heat Pump",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Toyota",
      model: "Hilux",
      price: 22400,
      shortDescription:
        "Toyota Hilux 2020 — وارد وكالة, diesel, four-wheel drive, worked but not abused, full service history.",
      condition: "USED" as const,
      bodyType: "PICKUP" as const,
      transmission: "MANUAL" as const,
      engineCapacityCC: 2393,
      fuelType: "DIESEL" as const,
      mileageKm: 88000,
      productionYear: 2020,
      waredWakaleh: true,
      specOrigin: "GCC" as const,
      isPromoted: false,
      detailedSpecs: [
        "4WD",
        "Differential Lock",
        "Tow Bar",
        "Bed Liner",
        "Hill Descent Control",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Volkswagen",
      model: "Golf GTI",
      price: 16500,
      shortDescription:
        "Volkswagen Golf GTI 2019 — European spec, DSG gearbox, recently serviced, drives faultlessly.",
      condition: "USED" as const,
      bodyType: "HATCHBACK" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1984,
      fuelType: "GAS" as const,
      mileageKm: 62000,
      productionYear: 2019,
      waredWakaleh: false,
      specOrigin: "EU" as const,
      isPromoted: false,
      detailedSpecs: [
        "DSG Transmission",
        "Sport Suspension",
        "Digital Cockpit",
        "Apple CarPlay",
        "LED Headlights",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "SOLD" as const,
      imageUrls: [],
      brand: "Ford",
      model: "Mustang",
      price: 19900,
      shortDescription:
        "Ford Mustang GT 2018 — American spec, 5.0 V8, performance exhaust, sold within a week of listing.",
      condition: "USED" as const,
      bodyType: "COUPE" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 4951,
      fuelType: "GAS" as const,
      mileageKm: 55000,
      productionYear: 2018,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: false,
      detailedSpecs: [
        "5.0L V8",
        "Performance Exhaust",
        "Brembo Brakes",
        "Launch Control",
        "Recaro Seats",
      ],
    },
    {
      userId: dealer2.id,
      dealershipId: dealership2.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "Honda",
      model: "Civic",
      price: 13200,
      shortDescription:
        "Honda Civic 2020 — American spec, sunroof, well kept interior, no accidents on record.",
      condition: "USED" as const,
      bodyType: "SEDAN" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 1996,
      fuelType: "GAS" as const,
      mileageKm: 61000,
      productionYear: 2020,
      waredWakaleh: false,
      specOrigin: "US" as const,
      isPromoted: false,
      detailedSpecs: [
        "Sunroof",
        "Honda Sensing",
        "Apple CarPlay",
        "Rear Camera",
        "Alloy Wheels",
      ],
    },
    {
      userId: dealer.id,
      dealershipId: dealership.id,
      status: "ON_SALE" as const,
      imageUrls: [],
      brand: "BYD",
      model: "Atto 3",
      price: 20500,
      shortDescription:
        "BYD Atto 3 2023 — وارد وكالة, essentially new, blade battery, full agency warranty remaining.",
      condition: "NEW" as const,
      bodyType: "SUV" as const,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 9000,
      productionYear: 2023,
      waredWakaleh: true,
      specOrigin: "OTHER" as const,
      isPromoted: false,
      detailedSpecs: [
        "Blade Battery",
        "Rotating Touchscreen",
        "Vehicle-to-Load",
        "Panoramic Roof",
        "Heat Pump",
      ],
    },
  ];

  for (const vehicleData of vehicles) {
    const data =
      vehicleData.imageUrls.length > 0
        ? vehicleData
        : {
            ...vehicleData,
            imageUrls: photosFor(
              vehicleData.brand,
              vehicleData.model,
              vehicleData.bodyType
            ),
          };
    const created = await prisma.vehicle.create({ data });
    console.log(
      `  ✓ Vehicle: ${created.brand} ${created.model} (${created.productionYear}) — ${created.status} — ${created.price.toLocaleString()} JOD`
    );
  }

  // ── Saved Vehicles (user favorites) ──────────────────────────
  const allVehicles = await prisma.vehicle.findMany({
    where: { status: "ON_SALE" },
    take: 3,
  });

  for (const v of allVehicles) {
    await prisma.savedVehicle.create({
      data: {
        userId: user.id,
        vehicleId: v.id,
      },
    });
  }
  console.log(`\n  ✓ Created ${allVehicles.length} saved vehicles for ${user.name}`);

  // ── Summary ──────────────────────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    dealerships: await prisma.dealership.count(),
    vehicles: await prisma.vehicle.count(),
    savedVehicles: await prisma.savedVehicle.count(),
  };

  console.log("\n🎉 Seeding complete!");
  console.log(`   Users: ${counts.users}`);
  console.log(`   Dealerships: ${counts.dealerships}`);
  console.log(`   Vehicles: ${counts.vehicles}`);
  console.log(`   Saved Vehicles: ${counts.savedVehicles}`);
  console.log("\n📧 Login credentials (all users):");
  console.log("   Password: Password123!");
  console.log(`   Admin:  admin@royalcars.jo`);
  console.log(`   Dealer: dealer@ammanluxury.jo`);
  console.log(`   User:   sara@gmail.com`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
