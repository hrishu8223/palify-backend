const db = require("../config/db");

const profileService = {};


// ✅ Get Profile
profileService.getProfile = async (user_id) => {
  const [[user]] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [user_id]
  );

  return user;
};


// ✅ Update Profile
profileService.updateProfile = async (user_id, data) => {
  const { full_name, email, phone, location, profile_pic } = data;

  await db.query(
    `UPDATE users 
     SET full_name=?, email=?, phone=?, location=?, profile_pic=? 
     WHERE id=?`,
    [full_name, email, phone, location, profile_pic, user_id]
  );

  return { message: "Profile updated successfully" };
};


// ✅ Update Language
profileService.updateLanguage = async (user_id, language) => {
  await db.query(
    "UPDATE users SET language=? WHERE id=?",
    [language, user_id]
  );

  return { message: "Language updated" };
};


module.exports = profileService;