import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
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

export default mongoose.models.Invoice ||
  mongoose.model<IInvoice>("Invoice", InvoiceSchema);
