const db = require("../config/db");

const businessService = async ({ business_id, user_id }) => {

  // basic
  const [basic] = await db.query(`
    SELECT b.*, 
    IF(f.user_id IS NOT NULL, 1, 0) as is_favorite
    FROM businesses b
    LEFT JOIN favorites f 
    ON b.id = f.business_id AND f.user_id = ?
    WHERE b.id = ?
  `, [user_id, business_id]);

  // services
  const [services] = await db.query(
    "SELECT name, price FROM services WHERE business_id = ?",
    [business_id]
  );

  // reviews
  const [reviews] = await db.query(
    "SELECT user_name as user, rating, comment FROM reviews WHERE business_id = ?",
    [business_id]
  );

  // team
  const [team] = await db.query(
    "SELECT name, role, image FROM team WHERE business_id = ?",
    [business_id]
  );

  return {
    basic: basic[0],
    services,
    reviews,
    team,
  };
};

// ✅ Get Business Profile
businessService.getProfile = async () => {
  const [[profile]] = await db.query(
    "SELECT * FROM business_profile LIMIT 1"
  );

  const [gallery] = await db.query(
    "SELECT * FROM gallery WHERE business_id=?",
    [profile.id]
  );

  const [[social]] = await db.query(
    "SELECT * FROM social_links WHERE business_id=?",
    [profile.id]
  );

  return { profile, gallery, social };
};



// ✅ Update Business Info
businessService.updateProfile = async (data) => {
  const { name, description, location, phone } = data;

  await db.query(
    `UPDATE business_profile 
     SET name=?, description=?, location=?, phone=? 
     WHERE id=1`,
    [name, description, location, phone]
  );

  return { message: "Business updated" };
};



// ✅ Add Gallery Image
businessService.addGallery = async (business_id, image) => {
  await db.query(
    "INSERT INTO gallery (business_id, image) VALUES (?, ?)",
    [business_id, image]
  );

  return { message: "Image added" };
};



// ✅ Delete Image
businessService.deleteImage = async (id) => {
  await db.query("DELETE FROM gallery WHERE id=?", [id]);
  return { message: "Image deleted" };
};



// ✅ Update Social Links
businessService.updateSocial = async (business_id, data) => {
  const { instagram, facebook, youtube } = data;

  await db.query(
    `UPDATE social_links 
     SET instagram=?, facebook=?, youtube=? 
     WHERE business_id=?`,
    [instagram, facebook, youtube, business_id]
  );

  return { message: "Social links updated" };
};


module.exports = businessService;