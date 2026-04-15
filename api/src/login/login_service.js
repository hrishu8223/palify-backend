// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const db = require("../config/db");
// require("dotenv").config();

// const loginService = async (data) => {
//   const { email_address, password } = data;

//   const [user] = await db.query(
//     "SELECT * FROM users WHERE email_address = ?",
//     [email_address]
//   );

//   if (user.length === 0) {
//     throw new Error("Invalid email or password");
//   }

//   const existingUser = user[0];

//   const isMatch = await bcrypt.compare(password, existingUser.password);

//   if (!isMatch) {
//     throw new Error("Invalid email or password");
//   }

//   // Check if user has admin role
//   // Support both is_admin flag and role column
//   const isAdmin =
//     existingUser.is_admin === 1 ||
//     existingUser.is_admin === true ||
//     existingUser.role === "admin" ||
//     existingUser.role === "superadmin";

//   if (!isAdmin) {
//     throw new Error("Access denied. Admin privileges required.");
//   }

//   const token = jwt.sign(
//     { id: existingUser.id, email: existingUser.email_address, role: "admin" },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

//   return {
//     id: existingUser.id,
//     full_name: existingUser.full_name,
//     email_address: existingUser.email_address,
//     token,
//   };
// };

// module.exports = { loginService };
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/db");
require("dotenv").config();

const loginService = async (data) => {
  const { email_address, password } = data;

  const [user] = await db.query(
    "SELECT * FROM users WHERE email_address = ?",
    [email_address]
  );

  if (user.length === 0) {
    throw new Error("Invalid email or password");
  }

  const existingUser = user[0];

  const isMatch = await bcrypt.compare(password, existingUser.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: existingUser.id, email: existingUser.email_address, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    id: existingUser.id,
    full_name: existingUser.full_name,
    email_address: existingUser.email_address,
    token,
  };
};

module.exports = { loginService };