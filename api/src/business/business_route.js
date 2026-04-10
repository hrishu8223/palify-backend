// const express = require("express");
// const router = express.Router();

// const { getBusinessDetails } = require("../business/business_controller");

// router.post("/details", getBusinessDetails);

// // ✅ Get Business Page (Preview)
// router.post("/getProfile", businessController.getProfile);
// // ✅ Update Bio & Description
// router.put("/update", businessController.updateProfile);

// // ✅ Gallery
// router.post("/addGallery", businessController.addGallery);
// router.delete("/gallery/:id", businessController.deleteImage);

// // ✅ Social Links
// router.put("/social/:business_id", businessController.updateProfile);

// module.exports = router;

const express = require("express");
const router = express.Router();

const businessController = require("../business/business_controller");

// ✅ Details
router.post("/details", businessController.getBusinessDetails);

// ✅ Profile
router.post("/getProfile", businessController.getProfile);

// ✅ Update
router.put("/update", businessController.updateProfile);

// ✅ Gallery
router.post("/addGallery", businessController.addGallery);
router.delete("/gallery/:id", businessController.deleteImage);

// ✅ Social
router.put("/social/:business_id", businessController.updateSocial);

module.exports = router;