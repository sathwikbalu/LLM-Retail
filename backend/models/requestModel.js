import mongoose from "mongoose";
const requestSchema= new mongoose.Schema( {

  from: { type: String },
  to: { type: String },
  product: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  message: String,
});

export default mongoose.model("Request",requestSchema);