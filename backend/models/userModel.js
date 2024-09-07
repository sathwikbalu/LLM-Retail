import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isOwner: {
      type: Boolean,
      required: true,
      default: false,
    },

    branch:{
      type:String,
      required:true,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;