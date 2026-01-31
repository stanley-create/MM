/**
 * Input Validation Utilities
 * Pydantic-like validation for React Native
 */

/**
 * Validates a numeric amount input
 * @param {string|number} value - The amount to validate
 * @param {number} min - Minimum allowed value (default: 0)
 * @param {number} max - Maximum allowed value (default: 1000000)
 * @returns {{valid: boolean, error: string|null, value: number|null}}
 */
export function validateAmount(value, min = 0, max = 1000000) {
  // Check if empty
  if (value === "" || value === null || value === undefined) {
    return { valid: false, error: "金額不可為空", value: null };
  }

  // Convert to number
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Check if valid number
  if (isNaN(numValue)) {
    return { valid: false, error: "請輸入有效數字", value: null };
  }

  // Check range
  if (numValue <= min) {
    return { valid: false, error: `金額必須大於 ${min}`, value: null };
  }

  if (numValue > max) {
    return { valid: false, error: `金額不可超過 ${max}`, value: null };
  }

  return { valid: true, error: null, value: numValue };
}

/**
 * Validates text description input
 * @param {string} value - The description to validate
 * @param {number} maxLength - Maximum length (default: 200)
 * @returns {{valid: boolean, error: string|null, value: string}}
 */
export function validateDescription(value, maxLength = 200) {
  const trimmed = (value || "").trim();

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `描述不可超過 ${maxLength} 字`,
      value: trimmed,
    };
  }

  return { valid: true, error: null, value: trimmed };
}

/**
 * Sanitizes user input to prevent XSS
 * @param {string} input - The input to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== "string") return "";

  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validates category selection
 * @param {string} category - The category to validate
 * @param {string[]} allowedCategories - List of allowed categories
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateCategory(
  category,
  allowedCategories = ["Food", "Transport", "Shop", "Ent.", "Bill"],
) {
  if (!allowedCategories.includes(category)) {
    return { valid: false, error: "無效的類別" };
  }
  return { valid: true, error: null };
}
