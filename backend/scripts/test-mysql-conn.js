const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || '103.61.121.161',
      user: process.env.DB_USERNAME || 'quangnh',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DATABASE || 'fastex_v3',
      port: Number(process.env.DB_PORT || 3306),
      connectTimeout: 15000,
    });
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('✅ Connected, rows:', rows);
    await conn.end();
  } catch (e) {
    console.error('❌ Connection failed:', e.code || e.message);
  }
})();