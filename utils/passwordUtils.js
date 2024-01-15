import bcrypt from "bcryptjs";
const encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSalt(10));
};

const validatePassword = (password, encryptedPassword) => {
  // password is actual vale
  // encrypted password is the value which is stored in encrypted way.
  return bcrypt.compareSync(password, encryptedPassword);
};

export { encryptPassword, validatePassword };
