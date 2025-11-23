export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - at least 8 digits
  const phoneRegex = /\d{8,}/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
}

export function validatePrice(price: number): boolean {
  return price > 0 && price < 1000000000; // Max 1 billion
}

export function validateArea(area: number): boolean {
  return area > 0 && area < 1000000; // Max 1 million sqm
}

export function validateRequired(value: string | null | undefined): boolean {
  return value !== null && value !== undefined && value.trim().length > 0;
}

export interface PropertyValidationErrors {
  title?: string;
  price?: string;
  city?: string;
  country?: string;
  area?: string;
  bedrooms?: string;
  bathrooms?: string;
}

export function validatePropertyData(data: {
  title: string;
  price: number;
  city: string;
  country: string;
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
}): PropertyValidationErrors {
  const errors: PropertyValidationErrors = {};

  if (!validateRequired(data.title)) {
    errors.title = "Title is required";
  } else if (data.title.length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (data.title.length > 200) {
    errors.title = "Title must be less than 200 characters";
  }

  if (!validatePrice(data.price)) {
    errors.price = "Invalid price";
  }

  if (!validateRequired(data.city)) {
    errors.city = "City is required";
  }

  if (!validateRequired(data.country)) {
    errors.country = "Country is required";
  }

  if (data.area !== null && data.area !== undefined && !validateArea(data.area)) {
    errors.area = "Invalid area";
  }

  if (
    data.bedrooms !== null &&
    data.bedrooms !== undefined &&
    (data.bedrooms < 0 || data.bedrooms > 100)
  ) {
    errors.bedrooms = "Bedrooms must be between 0 and 100";
  }

  if (
    data.bathrooms !== null &&
    data.bathrooms !== undefined &&
    (data.bathrooms < 0 || data.bathrooms > 100)
  ) {
    errors.bathrooms = "Bathrooms must be between 0 and 100";
  }

  return errors;
}
