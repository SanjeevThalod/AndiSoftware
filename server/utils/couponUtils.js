const validateCouponData = (data) => {
    const errors = [];
    
    if (data.discountType === 'percentage' && data.discountValue > 100) {
      errors.push("Percentage discount cannot be greater than 100%");
    }
    
    if (new Date(data.endDate) < new Date()) {
      errors.push("End date cannot be in the past");
    }
    
    if (data.startDate && new Date(data.endDate) < new Date(data.startDate)) {
      errors.push("End date must be after start date");
    }
    
    return errors;
  };
  
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const specialChars = '!@#$%^&*';
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const pos = Math.floor(Math.random() * code.length);
    const specialChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    code = code.slice(0, pos) + specialChar + code.slice(pos);
    
    return code;
  };