import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
    res.json({
        message: "API is working"
    })
}

// -----------------------------------------Update User Starts---------------------------------------------------------------

export const updateUser = async (req, res, next) => {
    // koi khudke account se dusre ka account delete na kr paaye
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account"));
    }

    try {
        // agr password khali nhi h kewal tbhi password update karo
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture
                }
            },
            {
                new: true
            }
        );

        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

// -----------------------------------------Update User Ends---------------------------------------------------------------




// -----------------------------------------Delete User Starts---------------------------------------------------------------

export const deleteUser = async (req, res, next) => {
    if (req.body.id !== req.params.id) {
        return next(errorHandler(401, "You can delete only your account"))
    }

    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (error) {
        next(error);
    }
}

// -----------------------------------------Delete User Ends---------------------------------------------------------------

