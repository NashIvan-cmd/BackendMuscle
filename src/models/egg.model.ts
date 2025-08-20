import mongoose from "mongoose";
import { BlockList } from "net";

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId;

export const EggSchema = new Schema({ 
    id: ObjectId,
    cookMethod: { 
        type: String, 
        required: true, 
        enum: ["boiled", "fried", "scramble"], // Throws a ValidationError
        default: "fried" 
    },
    bestConsumedBefore: {type: Date, required: true},
    ordered: { type: Boolean, default: false }
})
 
export const Egg = mongoose.model("Eggs", EggSchema); 