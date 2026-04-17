import mongoose from "mongoose";

const adminCredentialSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      default: "Administrator",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

adminCredentialSchema.methods.toJSON = function toJSON() {
  const data = this.toObject();
  delete data.passwordHash;
  return data;
};

const AdminCredential = mongoose.model("AdminCredential", adminCredentialSchema);

export default AdminCredential;
