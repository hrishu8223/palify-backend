require("dotenv").config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const app = require("./app");

// ✅ correct path
const db = require("./api/src/config/db");

const PORT = process.env.PORT || 5000;

db.getConnection()
  .then(() => {
    console.log("MySQL Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB Connection Failed ❌", err);
  });