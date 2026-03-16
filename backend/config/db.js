// config - db 연결정보에 관련된 폴더
require('dotenv').config();
const mysql = require('mysql2');

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // 추가 설정 (서버 환경에 맞게 조절 가능)
    connectionLimit: 10, // 동시에 유지할 연결 수
    waitForConnections: true, // 연결이 꽉 찼을 때 대기 여부
    queueLimit: 0, // 대기 줄의 제한 (0은 무제한)
});

conn.getConnection((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err.message);
        return;
    }
    console.log('MySQL 연결 성공');
});

module.exports = conn;
