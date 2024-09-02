import mongoose, { Document, Schema, type ObjectId } from "mongoose";
import type { TCreateUserInput } from "../schemas/user-schema";

export type TUser = TCreateUserInput &
  Document<ObjectId, any, TCreateUserInput>;

const userSchema = new Schema<TUser>(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "username is required!"],
    },
    hashedPassword: {
      type: String,
      trim: true,
      select: false,
      required: [true, "hashed password is required!"],
    },
  },
  { timestamps: true }
);

export type TUserDocument = Document<unknown, {}, TUser>;

const UserModel = mongoose.model<TUser>("User", userSchema);

export default UserModel;
