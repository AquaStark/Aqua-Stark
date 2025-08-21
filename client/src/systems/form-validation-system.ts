/**
 * Form Validation System
 * Provides validation utilities for dev console forms
 */

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates required string fields
 */
export function validateRequired(
  value: string,
  fieldName: string
): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates numeric string fields
 */
export function validateNumeric(
  value: string,
  fieldName: string
): ValidationResult {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  const numValue = parseInt(value, 10);
  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName} must be a valid number`,
    };
  }

  if (numValue < 0) {
    return {
      isValid: false,
      error: `${fieldName} must be a positive number`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates positive integer with optional minimum value
 */
export function validatePositiveInteger(
  value: string,
  fieldName: string,
  minValue: number = 1
): ValidationResult {
  const numericResult = validateNumeric(value, fieldName);
  if (!numericResult.isValid) {
    return numericResult;
  }

  const numValue = parseInt(value, 10);
  if (numValue < minValue) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minValue}`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates fish species selection
 */
export function validateFishSpecies(species: string): ValidationResult {
  const validSpecies = [
    'GoldFish',
    'AngelFish',
    'Betta',
    'NeonTetra',
    'Corydoras',
  ];

  if (!validSpecies.includes(species)) {
    return {
      isValid: false,
      error: 'Please select a valid fish species',
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates string length for Cairo felt conversion
 */
export function validateStringLength(
  value: string,
  fieldName: string,
  maxBytes: number = 31
): ValidationResult {
  if (!value) {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  // Check byte length for Cairo felt compatibility
  const byteLength = new TextEncoder().encode(value).length;
  if (byteLength > maxBytes) {
    return {
      isValid: false,
      error: `${fieldName} is too long (max ${maxBytes} bytes)`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validates address format (basic check)
 */
export function validateAddress(
  address: string,
  fieldName: string = 'Address'
): ValidationResult {
  if (!address || address.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }

  // Basic hex address validation
  if (!address.startsWith('0x')) {
    return {
      isValid: false,
      error: `${fieldName} must start with 0x`,
    };
  }

  if (address.length < 10) {
    return {
      isValid: false,
      error: `${fieldName} is too short`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validation helper for form fields used in Game.tsx
 */
export const GameFormValidators = {
  // Player validations
  username: (value: string) => validateStringLength(value, 'Username'),
  playerAddress: (value: string, required: boolean = false) =>
    required
      ? validateAddress(value, 'Player Address')
      : { isValid: true, error: null },

  // Aquarium validations
  aquariumId: (value: string) => validatePositiveInteger(value, 'Aquarium ID'),
  maxCapacity: (value: string) =>
    validatePositiveInteger(value, 'Max Capacity'),
  maxDecorations: (value: string) =>
    validatePositiveInteger(value, 'Max Decorations'),

  // Fish validations
  fishId: (value: string) => validatePositiveInteger(value, 'Fish ID'),
  fishSpecies: (value: string) => validateFishSpecies(value),
  parentId: (value: string) => validatePositiveInteger(value, 'Parent Fish ID'),

  // Decoration validations
  decorationId: (value: string) =>
    validatePositiveInteger(value, 'Decoration ID'),
  decorationName: (value: string) =>
    validateStringLength(value, 'Decoration Name'),
  decorationDesc: (value: string) =>
    validateStringLength(value, 'Decoration Description'),
  decorationPrice: (value: string) =>
    validatePositiveInteger(value, 'Decoration Price', 0),
  decorationRarity: (value: string) =>
    validatePositiveInteger(value, 'Decoration Rarity'),

  // General validations
  generation: (value: string) =>
    validatePositiveInteger(value, 'Generation', 0),
  ownerId: (value: string) => validatePositiveInteger(value, 'Owner ID'),
} as const;

/**
 * Batch validation helper
 */
export function validateMultipleFields(
  validations: Array<{ validator: () => ValidationResult; fieldName: string }>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const { validator, fieldName } of validations) {
    const result = validator();
    if (!result.isValid && result.error) {
      errors.push(`${fieldName}: ${result.error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
