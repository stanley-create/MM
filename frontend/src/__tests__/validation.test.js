import {
  validateAmount,
  validateDescription,
  sanitizeInput,
  validateCategory,
} from "../services/validation";

describe("Validation Utilities", () => {
  describe("validateAmount", () => {
    test("should reject empty amount", () => {
      const result = validateAmount("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("金額不可為空");
    });

    test("should reject non-numeric amount", () => {
      const result = validateAmount("abc");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("請輸入有效數字");
    });

    test("should reject amount <= 0", () => {
      const result = validateAmount(0);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("必須大於");
    });

    test("should reject amount > max", () => {
      const result = validateAmount(2000000, 0, 1000000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("不可超過");
    });

    test("should accept valid amount", () => {
      const result = validateAmount("500");
      expect(result.valid).toBe(true);
      expect(result.value).toBe(500);
      expect(result.error).toBeNull();
    });

    test("should accept valid numeric amount", () => {
      const result = validateAmount(1234.56);
      expect(result.valid).toBe(true);
      expect(result.value).toBe(1234.56);
    });
  });

  describe("validateDescription", () => {
    test("should accept empty description", () => {
      const result = validateDescription("");
      expect(result.valid).toBe(true);
      expect(result.value).toBe("");
    });

    test("should trim whitespace", () => {
      const result = validateDescription("  Hello  ");
      expect(result.valid).toBe(true);
      expect(result.value).toBe("Hello");
    });

    test("should reject description exceeding maxLength", () => {
      const longText = "a".repeat(250);
      const result = validateDescription(longText, 200);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("不可超過");
    });

    test("should accept valid description", () => {
      const result = validateDescription("Lunch at cafe");
      expect(result.valid).toBe(true);
      expect(result.value).toBe("Lunch at cafe");
    });
  });

  describe("sanitizeInput", () => {
    test("should sanitize HTML special characters", () => {
      const input = '<script>alert("XSS")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;",
      );
    });

    test("should handle quotes and slashes", () => {
      const input = "It's a test / example";
      const result = sanitizeInput(input);
      expect(result).toContain("&#x27;");
      expect(result).toContain("&#x2F;");
    });

    test("should return empty string for non-string input", () => {
      expect(sanitizeInput(null)).toBe("");
      expect(sanitizeInput(undefined)).toBe("");
      expect(sanitizeInput(123)).toBe("");
    });
  });

  describe("validateCategory", () => {
    test("should accept valid category", () => {
      const result = validateCategory("Food");
      expect(result.valid).toBe(true);
    });

    test("should reject invalid category", () => {
      const result = validateCategory("InvalidCat");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("無效的類別");
    });

    test("should use custom allowed categories", () => {
      const result = validateCategory("Custom", ["Custom", "Other"]);
      expect(result.valid).toBe(true);
    });
  });
});
