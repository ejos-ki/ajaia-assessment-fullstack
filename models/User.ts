// User model. Seeded manually via scripts/seed.ts — no public signup flow
// for this assessment (intentional scope cut, documented in README).

import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevents model overwrite errors during Next.js hot reload in dev.
export default models.User || model<IUser>("User", UserSchema);