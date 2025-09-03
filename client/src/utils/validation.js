// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation - checks if the password is at least 6 characters long
function validatePassword(password) {
  return password.length >= 6;
}

// Passwords match validation - checks if the password and confirm password fields match
function validatePasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}

// Minimum length validation - checks if the value has at least a specified minimum length
function validateMinLength(value, minLength = 2) {
  return value && value.trim().length >= minLength;
}

const validationUtils = {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
  validateMinLength,
};

export default validationUtils;
