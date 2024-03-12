import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";



// -----------------------------------Sign up Functionality starts-------------------------------------------------------------------------

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
}
// -----------------------------------Sign up Functionality ends-------------------------------------------------------------------------





// -----------------------------------Sign In Functionality starts-------------------------------------------------------------------------

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials"))
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        const { password: hashedPassword, ...rest } = validUser._doc;

        const expiryDate = new Date(Date.now() + 36000000);
        res
            .cookie("access_token", token, {
                httpOnly: true,
                expires: expiryDate
            })
            .status(200)
            .json(rest);
    } catch (error) {
        next(error)
    }
}

// -----------------------------------Sign In Functionality ends-------------------------------------------------------------------------





// -----------------------------------Sign In with google Functionality starts-------------------------------------------------------------------------


export const google = async (req, res, next) => {
    try {
        console.log("Backend me aaya email:",req.body.email);
        const user = await User.findOne({ email: req.body.email });
        console.log("I am backend user is: ",user);

        if (user) {
            console.log("User to h bro... pta nhi kaise?");
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: hashedPassword, ...rest } = user._doc;
            const expiryDate = new Date(Date.now() + 36000000);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                    expires: expiryDate
                })
                .status(200)
                .json(rest);
        } else {
            console.log("I am signing in with google")
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username:
                    req.body.name.split(" ").join("").toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                profilePicture: req.body.photo
            });
            console.log(newUser);

            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: hashedPassword2, ...rest } = newUser._doc;
            const expiryDate = new Date(Date.now() + 36000000);
            res
                .cookie("access_token", token, {
                    httpOnly: true,
                    expires: expiryDate
                })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error)
    }
}

// -----------------------------------Sign In with google Functionality ends-------------------------------------------------------------------------






// -----------------------------------Sign out Functionality starts-------------------------------------------------------------------------

export const signout = (req, res) => {
    res
        .clearCookie("access_token")
        .status(200)
        .json("Signout success");
}

// -----------------------------------Sign out Functionality Ends-------------------------------------------------------------------------
