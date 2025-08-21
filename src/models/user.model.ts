import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

export const UserSchema = new Schema({ 
    id: ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["chef", "expeditor", "customer"],
      default: "customer"  
    },
    date: Date,
    session: { type: Date, required: true }
})

export const User = mongoose.model('User', UserSchema);