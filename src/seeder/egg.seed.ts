import mongoose from "mongoose";
import { EggSchema } from "../models/egg.model";
import { localConnectDB, closeDB } from "../configs/mongoose.config";

const Egg = mongoose.model("Eggs", EggSchema);

async function eggSeed() {
    try {
        await localConnectDB();

        const egg = new Egg({
            cookingMethod: "boiled",
            bestConsumedBefore: Date.now() 
        });

        await egg.save();

        const findEgg = await Egg.find();
        console.log({ findEgg });

    } catch (error) {
        console.error("Error", error);
    } finally {
        await closeDB();
    }
}

eggSeed();