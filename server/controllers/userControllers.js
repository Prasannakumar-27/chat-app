const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("User not found");
    }
});

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
});

const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});

const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        console.log("Profile update request received:", {
            userId: req.user._id,
            hasName: !!req.body.name,
            hasPic: !!req.body.pic,
            hasPassword: !!req.body.password
        });

        const user = await User.findById(req.user._id);

        if (!user) {
            console.error("User not found:", req.user._id);
            res.status(404);
            throw new Error("User not Found");
        }

        console.log("User found, updating fields...");

        user.name = req.body.name || user.name;
        user.pic = req.body.pic || user.pic;

        // Only update password if a new one is provided
        if (req.body.password && req.body.password.trim() !== "") {
            console.log("Updating password...");
            user.password = req.body.password;
        }

        console.log("Saving user...");
        const updatedUser = await user.save();
        console.log("User saved successfully");

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            pic: updatedUser.pic,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500);
        throw error;
    }
});

module.exports = { registerUser, authUser, allUsers, updateUserProfile };
