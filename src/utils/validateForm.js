// src/utils/validateForm.js
const validateForm = (formData, requiredFields) => {
    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });
    return errors;
  };
  
  export default validateForm;