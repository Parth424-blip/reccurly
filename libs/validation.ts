export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}

export const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email";
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain a number";
  }
  return undefined;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

export const validateFirstName = (firstName: string): string | undefined => {
  if (!firstName.trim()) {
    return "First name is required";
  }
  if (firstName.trim().length < 2) {
    return "First name must be at least 2 characters";
  }
  return undefined;
};

export const validateLastName = (lastName: string): string | undefined => {
  if (!lastName.trim()) {
    return "Last name is required";
  }
  if (lastName.trim().length < 2) {
    return "Last name must be at least 2 characters";
  }
  return undefined;
};

export const parseClerkError = (error: any): string => {
  // Handle Clerk-specific errors
  if (error?.errors?.length > 0) {
    const clerkError = error.errors[0];
    if (clerkError.code === "form_identifier_exists") {
      return "This email is already registered";
    }
    if (clerkError.code === "form_password_invalid") {
      return "Password is incorrect";
    }
    if (clerkError.code === "form_identifier_not_found") {
      return "Email not found";
    }
    if (clerkError.message) {
      return clerkError.message;
    }
  }
  // Handle generic errors
  if (error?.message) {
    return error.message;
  }
  return "An error occurred. Please try again.";
};
