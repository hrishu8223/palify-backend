const db = require("../config/db");

// ── Submit a rating ───────────────────────────────────────────
const submitRating = async (userId, { bookingId, stars, feedback, image }) => {
  // Verify completed booking belongs to user
  const [bk] = await db.query(
    "SELECT id, business_id FROM bookings WHERE id = ? AND user_id = ? AND status = 'completed'",
    [bookingId, userId]
  );
  if (!bk.length) throw new Error("Only completed bookings can be rated");

  const { business_id } = bk[0];

  const [result] = await db.query(
    "INSERT INTO ratings (booking_id, user_id, business_id, stars, feedback, image) VALUES (?, ?, ?, ?, ?, ?)",
    [bookingId, userId, business_id, stars, feedback, image || null]
  );

  // Recalculate business avg rating
  await db.query(
    "UPDATE businesses SET rating = (SELECT AVG(stars) FROM ratings WHERE business_id = ?) WHERE id = ?",
    [business_id, business_id]
  );

  const [rows] = await db.query("SELECT * FROM ratings WHERE id = ?", [result.insertId]);
  return rows[0];
};

// ── Get ratings for a business ────────────────────────────────
const getBusinessRatings = async (businessId) => {
  const [rows] = await db.query(
    `SELECT r.*, u.name AS user_name, u.avatar AS user_avatar
     FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.business_id = ?
     ORDER BY r.created_at DESC`,
    [businessId]
  );
  return rows;
};

module.exports = { submitRating, getBusinessRatings };