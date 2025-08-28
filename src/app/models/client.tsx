// src/models/Client.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  address: string;
  serviceType: string;
  joiningDate: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    serviceType: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Client as mongoose.Model<IClient>) ||
  mongoose.model<IClient>("Client", ClientSchema);
