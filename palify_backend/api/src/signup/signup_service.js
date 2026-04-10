const db = require("../config/db");
const bcrypt = require("bcryptjs");

const signupService = async (data) => {
  const { full_name, email_address, password } = data;

  const [user] = await db.query(
    "SELECT * FROM users WHERE email_address = ?",
    [email_address]
  );

  if (user.length > 0) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await db.query(
    "INSERT INTO users (full_name, email_address, password) VALUES (?, ?, ?)",
    [full_name, email_address, hashedPassword]
  );

  return {
    id: result.insertId,
    full_name,
    email_address
  };
};

module.exports = { signupService }; 