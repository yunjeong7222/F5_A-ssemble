// config - db 연결정보에 관련된 폴더
require("dotenv").config();
const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

conn.connect((err) => {
  if (err) {
    console.error("MySQL 연결 실패:", err.message);
    return;
  }
  console.log("MySQL 연결 성공");
});

module.exports = conn;