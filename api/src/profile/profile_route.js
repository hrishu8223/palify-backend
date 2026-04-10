const express = require("express");
const router = express.Router();

const profileController = require("./profile_controller");

// ✅ Get Profile
router.post("/:user_id", profileController.getProfile);

// ✅ Update Profile
router.put("/:user_id", profileController.updateProfile);

// ✅ Update Language
router.put("/language/:user_id", profileController.updateLanguage);

module.exports = router;