import { Response, NextFunction, Request } from "express";
import { ExpressHandle } from "../utils/fnType.utils";
import { User } from "../models/user.model";
import { responseHelper } from "../helper/response.helper";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../middleware/error.middleware";
import { genAccessToken, genRefreshToken, saveToken } from "../middleware/auth.middleware";

let registerExecutioner: ExpressHandle | null = null;
let loginExecutioner: ExpressHandle | null = null;


const registerFn = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, role } = req.body;
    try {
    
        if (!username || !password) {
            throw new BadRequestError({code: 400, message: "Missing Username or Password", logging: false });
        }

        // Simulteneously create and save a new user;
        const user = await User.create({ 
            username,
            password,
            role,
            date: Date.now(),
            session: Date.now()
        });

        return responseHelper(res, 201, user, { keyName: "user" });
    } catch (error) {
        next(error);
    }
}

export const setCreateAccProcessor = () => {
    registerExecutioner = registerFn;
}

export const loginFn = async (req: Request, res: Response, next: NextFunction) => {
    console.log("New Login Request");
    const { username, password } = req.body;
    try {
        if (!username) { 
            throw new BadRequestError({ code: 400, message: "Missing username" })
        }

        if (!password) { 
            throw new BadRequestError({ code: 400, message: "Missing password" })
        }

        const user = await User.findOne({ 'username': username })
        console.log("User creds: ", user);

        if (!user) {
            throw new NotFoundError({ code: 404, message: "Invalid Username" })
        }

        // res.send(user);

        const checkPassword = user.password == password ? true : false;
        // console.log("User pass: ", user.password);

        console.log({ checkPassword });
        if(!checkPassword) {
            // This should be validation error;
            throw new UnauthorizedError({ message: "Wrong password" });
        }

        if (!user._id || !user.role) throw new NotFoundError({ code: 404, message: "Missing Id or Role" })
        

        const accessToken = genAccessToken(user._id.toString(), user.role);
        // console.log({ accessToken });
        
        const refreshT = genRefreshToken(user._id.toString());

        // Saves token into Redis
        await saveToken(user.id, refreshT);
        
        // Stateless approach
        // res.cookie != response it just sets a cookie
        res.cookie("authorization", accessToken, { httpOnly: true });

        res.send("Login Success");
    } catch (error) {
        next(error);
    }
}

export const setLoginProcessor = () => {
    loginExecutioner = loginFn;
}

export const logOut = async (req: Request, res: Response, next: NextFunction) => {
    
}

