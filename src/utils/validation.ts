export interface ValidationResult {
  valid: boolean;
  message: string;
}

export function validateFlashcardField(value: string, label: string): ValidationResult {
  const trimmed = (value ?? '').trim();
  if (trimmed.length === 0) {
    return { valid: false, message: `The ${label} cannot be empty.` };
  }
  return { valid: true, message: '' };
}
