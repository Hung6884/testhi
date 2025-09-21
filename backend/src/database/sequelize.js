// src/database/sequelize.js (hoặc tương đương)
const { Sequelize, DataTypes } = require('sequelize');
const modelDefiners = require('./models');   // <-- một MẢNG các hàm define(...)
const envConfigs = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const config = envConfigs[env];

const sequelize = new Sequelize(
  config.defaultDatabase,
  config.username,
  config.password,
  config.options,
);

// ✅ PHẢI TRUYỀN CẢ DataTypes vào mỗi model definer
for (const def of modelDefiners) {
  def(sequelize, DataTypes);
}

// Gọi associate nếu có
for (const name of Object.keys(sequelize.models)) {
  if (sequelize.models[name].associate) {
    sequelize.models[name].associate(sequelize.models);
  }
}

console.log('[DB] loaded models =', Object.keys(sequelize.models)); // <-- PHẢI thấy 'users'

module.exports.sequelize = sequelize;
