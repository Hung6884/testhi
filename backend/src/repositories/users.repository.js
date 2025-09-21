// src/repositories/users.repository.js
const { Sequelize, models } = require('../database'); // lấy đúng interface mới
const User = models.users; // 'users' là key bạn define

if (!User) {
  console.error('[users.repo] models keys =', Object.keys(models));
  throw new Error("Không thấy model 'users' trong sequelize.models.");
}

const findByUserName = async (username) => {
  return User.findOne({
    where: {
      username: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('username')),
        Sequelize.Op.eq,
        String(username || '').toLowerCase()
      ),
    },
    raw: true,
  });
};

module.exports = { findByUserName };
