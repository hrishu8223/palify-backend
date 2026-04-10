const profileService = require("./profile_service");

const profileController = {};


// ✅ Get Profile
profileController.getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await profileService.getProfile(user_id);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ Update Profile
profileController.updateProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await profileService.updateProfile(user_id, req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ Update Language
profileController.updateLanguage = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { language } = req.body;

    const data = await profileService.updateLanguage(user_id, language);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = profileController;