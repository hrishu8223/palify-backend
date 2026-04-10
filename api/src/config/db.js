const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "palify_db",
});

// promise wrapper
const db = pool.promise();

module.exports = db;