// Tracks which users currently have a document open, for a lightweight
// "who's viewing this" indicator (similar to Canva/Figma avatar stacks).
// Uses short-interval polling rather than WebSockets — simpler to build
// and deploy on Vercel's serverless model, at the cost of a few seconds
// of lag versus true real-time. Documented as an intentional tradeoff.

import mongoose, { Schema, models, model } from "mongoose";

export interface IPresence {
  _id: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  lastSeenAt: Date;
}

const PresenceSchema = new Schema<IPresence>({
  documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  lastSeenAt: { type: Date, required: true, default: Date.now },
});

// One presence record per user per document — heartbeats update the
// same record rather than creating new ones.
PresenceSchema.index({ documentId: 1, userId: 1 }, { unique: true });

export default models.Presence || model<IPresence>("Presence", PresenceSchema);