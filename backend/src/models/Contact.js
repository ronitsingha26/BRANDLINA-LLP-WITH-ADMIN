import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true },
    inquiryType: { type: String, enum: ["contact", "book_call"], default: "contact" },
    sourcePage: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["pending", "done"], default: "pending" },
  },
  { timestamps: true },
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
