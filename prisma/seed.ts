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
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 3982,
      fuelType: "GAS" as const,
      mileageKm: 12500,
      originSpec: "GULF" as const,
      productionYear: 2023,
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
      seats: 4,
      transmission: "AUTO" as const,
      engineCapacityCC: 2993,
      fuelType: "GAS" as const,
      mileageKm: 350,
      originSpec: "EUROPEAN" as const,
      productionYear: 2024,
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
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 2894,
      fuelType: "GAS" as const,
      mileageKm: 800,
      originSpec: "EUROPEAN" as const,
      productionYear: 2024,
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
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 2487,
      fuelType: "HYBRID" as const,
      mileageKm: 34000,
      originSpec: "JORDANIAN" as const,
      productionYear: 2022,
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
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 2997,
      fuelType: "DIESEL" as const,
      mileageKm: 18000,
      originSpec: "GULF" as const,
      productionYear: 2023,
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
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 3996,
      fuelType: "GAS" as const,
      mileageKm: 9200,
      originSpec: "EUROPEAN" as const,
      productionYear: 2023,
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
      seats: 7,
      transmission: "AUTO" as const,
      engineCapacityCC: 3346,
      fuelType: "DIESEL" as const,
      mileageKm: 21000,
      originSpec: "GULF" as const,
      productionYear: 2023,
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
        "Kia EV6 GT-Line 2024 — Chinese spec, Yacht Blue, 77.4kWh battery, 800V ultra-fast charging, excellent range.",
      condition: "NEW" as const,
      bodyType: "HATCHBACK" as const,
      seats: 5,
      transmission: "AUTO" as const,
      engineCapacityCC: 0,
      fuelType: "ELECTRIC" as const,
      mileageKm: 1200,
      originSpec: "CHINESE" as const,
      productionYear: 2024,
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
  ];

  for (const vehicleData of vehicles) {
    const created = await prisma.vehicle.create({ data: vehicleData });
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
