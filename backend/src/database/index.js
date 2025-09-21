// src/database/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const envConfigs = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

const sequelize = new Sequelize(
  config.defaultDatabase,
  config.username,
  config.password,
  config.options
);

// ===== Autoload models =====
const modelsDir = path.join(__dirname, 'models');
const skipNames = new Set(['index.js', 'init-models.js']); // tránh loop/đụng file sinh tự động

for (const file of fs.readdirSync(modelsDir)) {
  if (!file.endsWith('.js')) continue;
  if (skipNames.has(file)) continue;

  const full = path.join(modelsDir, file);
  const mod = require(full);
  const definer = mod && (mod.default || mod);

  if (typeof definer !== 'function') continue;

  try {
    // HỖ TRỢ CẢ HAI KIỂU: (sequelize, DataTypes) và (sequelize)
    if (definer.length >= 2) {
      definer(sequelize, DataTypes);       // factory define(..., DataTypes)
    } else {
      definer(sequelize);                  // class-based init(...)
    }
  } catch (e) {
    console.error(`[DB] Lỗi nạp model từ ${file}:`, e.message);
    throw e;
  }
}

// Gọi associate nếu model có
for (const name of Object.keys(sequelize.models)) {
  const model = sequelize.models[name];
  if (typeof model.associate === 'function') {
    model.associate(sequelize.models);
  }
}

console.log('[DB] loaded models =', Object.keys(sequelize.models));

// ===== Export =====
// Giữ interface rõ ràng cho mọi nơi dùng:
module.exports = {
  sequelize,          // instance
  Sequelize,          // class, để dùng fn, Op, ...
  models: sequelize.models,  // tập hợp tất cả models đã nạp
};
