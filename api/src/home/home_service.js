const db = require("../config/db");

const homeService = async (user_id) => {

  // user
  const [user] = await db.query(
    "SELECT full_name FROM users WHERE id = ?",
    [user_id]
  );

  // categories
  const [categories] = await db.query(`
    SELECT c.id, c.name, c.icon,
    (SELECT COUNT(*) FROM businesses b WHERE b.category_id = c.id) as business_count
    FROM categories c
  `);

  // featured
  const [featured] = await db.query(`
    SELECT b.id, b.name, b.image, b.rating, b.reviews,
    IF(f.user_id IS NOT NULL, 1, 0) as is_favorite
    FROM businesses b
    LEFT JOIN favorites f 
    ON b.id = f.business_id AND f.user_id = ?
    WHERE b.is_featured = 1
  `, [user_id]);

  // nearby
  const [nearby] = await db.query(`
    SELECT b.id, b.name, c.name as category, b.rating, b.reviews,
    IF(f.user_id IS NOT NULL, 1, 0) as is_favorite
    FROM businesses b
    LEFT JOIN categories c ON b.category_id = c.id
    LEFT JOIN favorites f 
    ON b.id = f.business_id AND f.user_id = ?
  `, [user_id]);

  return {
    user: {
      name: user[0]?.full_name || "User",
    },
    categories,
    featured,
    nearby,
  };
};

module.exports = homeService;