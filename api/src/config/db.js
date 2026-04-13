// // const mysql = require("mysql2");

// // const pool = mysql.createPool({
// //   host: "localhost",
// //   user: "root",
// //   password: "",
// //   database: "palify_db",
// // });

// // // promise wrapper
// // const db = pool.promise();

// // module.exports = db;
// const mysql = require("mysql2");

// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST,
//   user: process.env.MYSQLUSER,
//   password: process.env.MYSQL_ROOT_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
//   port: process.env.MYSQLPORT || 3306,
// });

// const db = pool.promise();

// module.exports = db;
// const pool = mysql.createPool({
//   host: process.env.MYSQLHOST || 'mysql.railway.internal',
//   user: process.env.MYSQLUSER || 'root',
//   password: process.env.MYSQL_ROOT_PASSWORD || '',
//   database: process.env.MYSQL_DATABASE || 'railway',
//   port: process.env.MYSQLPORT || 3306,
// });
// const db = pool.promise();
// module.exports = db;
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: 'mysql.railway.internal',
  user: 'root',
  password: 'fXEmbUfbPBfqTCoXPOidPaejlIjdKrpv',
  database: 'railway',
  port: 3306,
});

const db = pool.promise();

module.exports = db;