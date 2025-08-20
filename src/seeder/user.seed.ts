import mongoose from "mongoose";
import { UserSchema } from '../models/user.model'
import { localConnectDB, closeDB } from "../configs/mongoose.config";

const User = mongoose.model('User', UserSchema);

async function userSeed () {
    try {
        await localConnectDB();

        const user = new User({
            username: "Blaice Chan",
            password: "HashMePlease",
            role: "customer",
            date: Date.now(),
            session: Date.now()
        })

        const savedUser = await user.save();
        console.log("User succesfuly saved");

        console.log({ savedUser });

        const foundUsers = await User.find();
        console.log({ foundUsers });
        
    } catch (error) {
        console.error("User Seed", error);
    } finally {
        await closeDB();
    }
}

userSeed();