// src/models/Client.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  ownerEmail: string;  // 🔒 identifies which user owns this client
  // OR: ownerId?: mongoose.Types.ObjectId; // if you want to link to User collection

  name: string;
  address: string;
  serviceType: string;
  joiningDate: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    ownerEmail: { type: String, required: true, index: true }, // ✅ add this

    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Normalize email before save
ClientSchema.pre("save", function (next) {
  if (this.ownerEmail) this.ownerEmail = this.ownerEmail.toLowerCase();
  next();
});

export default (mongoose.models.Client as mongoose.Model<IClient>) ||
  mongoose.model<IClient>("Client", ClientSchema);
