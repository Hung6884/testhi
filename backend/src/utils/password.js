const bcrypt = require('bcryptjs');

const isPasswordMatch = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const hashPassword = async (password) => {
  return await bcrypt.hashSync(password, 12);
};

module.exports = {
  isPasswordMatch,
  hashPassword,
};
