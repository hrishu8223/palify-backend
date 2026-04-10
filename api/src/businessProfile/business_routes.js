const express = require("express");
const router = express.Router();

const businessController = require("./business_controller");

// ✅ Get Business Page (Preview)
router.post("/getProfile", businessController.getProfile);
// ✅ Update Bio & Description
router.put("/update", businessController.updateProfile);

// ✅ Gallery
router.post("/addGallery", businessController.addGallery);
router.delete("/gallery/:id", businessController.deleteImage);

// ✅ Social Links
router.put("/social/:business_id", businessController.updateSocial);

module.exports = router;