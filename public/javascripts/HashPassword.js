const bcrypt = require("bcryptjs");

const HashedPassword = async (password) => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

module.exports = HashedPassword;
