const businessService = require("../businessProfile/business_service");

const businessController = {};


// ✅ Get Profile
businessController.getProfile = async (req, res) => {
  try {
    const data = await businessService.getProfile();

    res.json({
      success: true,
      message: "Business profile fetched",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



// ✅ Update Profile
businessController.updateProfile = async (req, res) => {
  try {
    const data = await businessService.updateProfile(req.body);

    res.json({
      success: true,
      message: "Profile updated",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



// ✅ Add Gallery
businessController.addGallery = async (req, res) => {
  try {
    const { business_id, image } = req.body;

    const data = await businessService.addGallery(business_id, image);

    res.json({ success: true, message: "Image added", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



// ✅ Delete Image
businessController.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await businessService.deleteImage(id);

    res.json({ success: true, message: "Image deleted", data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};



// ✅ Update Social
businessController.updateSocial = async (req, res) => {
  try {
    const { business_id } = req.params;

    const data = await businessService.updateSocial(
      business_id,
      req.body
    );

    res.json({
      success: true,
      message: "Social updated",
      data,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


module.exports = businessController;