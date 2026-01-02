import { useMemo } from "react";

interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  message: string;
}

export function usePasswordValidation(password: string): PasswordValidation {
  return useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValid = hasMinLength && hasNumber && hasSpecialChar;

    let message = "";
    if (password.length > 0 && !isValid) {
      const missing: string[] = [];
      if (!hasMinLength) missing.push("8+ characters");
      if (!hasNumber) missing.push("1 number");
      if (!hasSpecialChar) missing.push("1 special character");
      message = `Password needs: ${missing.join(", ")}`;
    }

    return {
      isValid,
      hasMinLength,
      hasNumber,
      hasSpecialChar,
      message,
    };
  }, [password]);
}
