// src/utils/passwordStrength.js
const evaluatePasswordStrength = (password) => {
    let score = 0;
    const minLength = 8;
  
    // Check length
    if (password.length >= minLength) score += 1;
    if (password.length >= 12) score += 1;
  
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) score += 1;
  
    // Check for lowercase letters
    if (/[a-z]/.test(password)) score += 1;
  
    // Check for numbers
    if (/[0-9]/.test(password)) score += 1;
  
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
  
    // Determine strength level
    let strength = 'Weak';
    let color = 'bg-red-500';
    if (score >= 5) {
      strength = 'Strong';
      color = 'bg-green-500';
    } else if (score >= 3) {
      strength = 'Medium';
      color = 'bg-yellow-500';
    }
  
    return { score, strength, color };
  };
  
  export default evaluatePasswordStrength;