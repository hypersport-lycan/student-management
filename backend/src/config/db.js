const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ADD THIS CATCH BLOCK AT THE BOTTOM:
// It tests the pool instantly on bootup without stalling your module export exports.
pool.getConnection()
  .then((conn) => {
    console.log("🚀 [Database] Connected successfully to MySQL!");
    conn.release();
  })
  .catch((err) => {
    console.error("⏳ [Database] Warning: MySQL is still initializing. Pool will retry on first query.", err.message);
  });

module.exports = pool;
