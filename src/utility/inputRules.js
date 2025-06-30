export const validationRules = {
  name: {
    pattern: /^[A-Za-zĄąČčĘęĖėĮįŠšŲųŪūŽž\s]{2,50}$/,
    message: 'Name should be 2-50 characters long and contain only letters'
  },
  surname: {
    pattern: /^[A-Za-zĄąČčĘęĖėĮįŠšŲųŪūŽž\s]{2,50}$/,
    message: 'Surname should be 2-50 characters long and contain only letters'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    pattern: /^\+?[0-9]{8,15}$/,
    message: 'Please enter a valid phone number'
  },
  address: {
    pattern: /^[A-Za-z0-9ĄąČčĘęĖėĮįŠšŲųŪūŽž\s,.-]{5,100}$/,
    message: 'Address should be 5-100 characters long'
  },
  city: {
    pattern: /^[A-Za-zĄąČčĘęĖėĮįŠšŲųŪūŽž\s]{2,50}$/,
    message: 'City should contain only letters'
  },
  postalCode: {
    pattern: /^[A-Z0-9]{5}$/,
    message: 'Please enter a valid postal code (e.g., LT123)'
  },
  password: {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    message: 'Password must be at least 8 characters long and contain letters and numbers'
  },
  message: {
    pattern: /^[\s\S]{10,500}$/,
    message: 'Message should be between 10 and 500 characters'
  }
};

export const validateField = (field, value) => {
  const rule = validationRules[field];
  if (!rule) return { isValid: true, message: '' };
  
  const isValid = rule.pattern.test(value);
  return {
    isValid,
    message: isValid ? '' : rule.message
  };
};

export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;

  fields.forEach(field => {
    const result = validateField(field, formData[field]);
    if (!result.isValid) {
      errors[field] = result.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};