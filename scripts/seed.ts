// Seeds the database with fixed demo users, since the assessment scope
// explicitly allows mocked/seeded auth instead of a real signup flow.
// Run with: npm run seed

import { config } from "dotenv";
config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

const SEED_USERS = [
  { name: "Alice Reviewer", email: "alice@example.com", password: "password123" },
  { name: "Bob Reviewer", email: "bob@example.com", password: "password123" },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Missing MONGODB_URI");

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await User.deleteMany({});
  console.log("Cleared existing users");

  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, passwordHash });
    console.log(`Created user: ${u.email} / ${u.password}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});