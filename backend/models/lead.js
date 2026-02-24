import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    company: {
      type: String
    },
    message: {
      type: String
    },
    source: {
      type: String
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Converted"],
      default: "New"
    },
    notes: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);