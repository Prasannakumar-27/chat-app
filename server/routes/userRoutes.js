const express = require("express");
const {
    registerUser,
    authUser,
    allUsers,
    updateUserProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.route("/profile").put(protect, updateUserProfile);
router.post("/login", authUser);

module.exports = router;
