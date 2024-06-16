// src/utils/validators.js
export const isEmailValid = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isPasswordStrong = (password) => {
  return password.length >= 8;
};
