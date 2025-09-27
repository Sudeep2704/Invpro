import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvoice extends Document {
  ownerEmail: string;                 // 🔒 who owns this invoice
  // OR: ownerId?: Types.ObjectId;    // (use this instead if you prefer user ObjectId)

  fyYear: string;
  clientId?: Types.ObjectId | null;
  name: string;
  date: Date;
  number: string;
  amount: number;
  description: string;
  isPaid: boolean;
  paymentDate?: Date;
  pdfUrl: string;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    ownerEmail: { type: String, required: true, index: true }, // ✅ required + indexed
    // ownerId: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },

    fyYear: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: false },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    number: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    isPaid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true }
);

// Optional but helpful: prevent duplicate invoice numbers for the same user
InvoiceSchema.index({ ownerEmail: 1, number: 1 }, { unique: false });

// Normalize ownerEmail
InvoiceSchema.pre("save", function (next) {
  if (this.ownerEmail) this.ownerEmail = this.ownerEmail.toLowerCase();
  next();
});

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
