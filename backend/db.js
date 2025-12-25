const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abhishek@34",   // 👈 EXACT password you used in MySQL
  database: "neighborhood_help_portal"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;


