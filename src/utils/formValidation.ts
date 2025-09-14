export interface ValidationError {
  field: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  serviceInterest: string;
  message: string;
  consultationRequested: boolean;
}

// Enhanced form validation with detailed error messages
export const validateContactForm = (formData: ContactFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: 'Full name is required' });
  } else if (formData.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
    errors.push({ field: 'name', message: 'Name can only contain letters, spaces, hyphens, and apostrophes' });
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.push({ field: 'email', message: 'Email address is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation (if provided)
  if (formData.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
  }

  // Company validation (optional but with length check)
  if (formData.company.trim() && formData.company.trim().length > 100) {
    errors.push({ field: 'company', message: 'Company name must be less than 100 characters' });
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (formData.message.trim().length < 10) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
  } else if (formData.message.trim().length > 1000) {
    errors.push({ field: 'message', message: 'Message must be less than 1000 characters' });
  }

  return errors;
};

// Sanitize user input
export const sanitizeFormData = (formData: ContactFormData): ContactFormData => {
  return {
    name: formData.name.trim().replace(/\s+/g, ' '),
    email: formData.email.trim().toLowerCase(),
    company: formData.company.trim().replace(/\s+/g, ' '),
    phone: formData.phone.trim(),
    serviceInterest: formData.serviceInterest.trim(),
    message: formData.message.trim(),
    consultationRequested: formData.consultationRequested
  };
};

// Check for spam patterns (basic implementation)
export const detectSpam = (formData: ContactFormData): boolean => {
  const spamPatterns = [
    /\b(click here|visit now|buy now)\b/i,
    /https?:\/\/[^\s]+\.(tk|ml|ga|cf)\b/i,
    /\b(viagra|cialis|casino|lottery|winner)\b/i,
    /\b[A-Z]{5,}\b/g, // Too many capital letters
  ];

  const allText = `${formData.name} ${formData.company} ${formData.message}`.toLowerCase();

  return spamPatterns.some(pattern => pattern.test(allText));
};