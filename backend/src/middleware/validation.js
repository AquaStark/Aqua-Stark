import { logger } from '../utils/logger.js';

/**
 * Unified validation middleware for Aqua Stark backend
 * Provides centralized validation functions to avoid logic duplication
 *
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */

/**
 * Validation error class for structured error handling
 */
export class ValidationError extends Error {
  constructor(message, field = null, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
  }
}

/**
 * Validation result class for structured validation responses
 */
export class ValidationResult {
  constructor(isValid = true, errors = [], warnings = []) {
    this.isValid = isValid;
    this.errors = errors;
    this.warnings = warnings;
  }

  addError(message, field = null, code = 'VALIDATION_ERROR') {
    this.errors.push({ message, field, code });
    this.isValid = false;
  }

  addWarning(message, field = null) {
    this.warnings.push({ message, field });
  }
}

/**
 * Basic data type validators
 */
export const validators = {
  /**
   * Validates if a value is required (not null, undefined, or empty string)
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  required(value, fieldName = 'field') {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is a string
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  string(value, fieldName = 'field') {
    if (typeof value !== 'string') {
      throw new ValidationError(`${fieldName} must be a string`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is a number
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  number(value, fieldName = 'field') {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(`${fieldName} must be a number`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is an integer
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  integer(value, fieldName = 'field') {
    if (!Number.isInteger(value)) {
      throw new ValidationError(`${fieldName} must be an integer`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is a boolean
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  boolean(value, fieldName = 'field') {
    if (typeof value !== 'boolean') {
      throw new ValidationError(`${fieldName} must be a boolean`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is an array
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  array(value, fieldName = 'field') {
    if (!Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an array`, fieldName);
    }
    return true;
  },

  /**
   * Validates if a value is an object
   * @param {*} value - Value to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  object(value, fieldName = 'field') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an object`, fieldName);
    }
    return true;
  },

  /**
   * Validates string length
   * @param {string} value - Value to validate
   * @param {number} min - Minimum length
   * @param {number} max - Maximum length
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  stringLength(value, min = 0, max = Infinity, fieldName = 'field') {
    this.string(value, fieldName);
    if (value.length < min) {
      throw new ValidationError(
        `${fieldName} must be at least ${min} characters long`,
        fieldName
      );
    }
    if (value.length > max) {
      throw new ValidationError(
        `${fieldName} must be no more than ${max} characters long`,
        fieldName
      );
    }
    return true;
  },

  /**
   * Validates number range
   * @param {number} value - Value to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  numberRange(value, min = -Infinity, max = Infinity, fieldName = 'field') {
    this.number(value, fieldName);
    if (value < min) {
      throw new ValidationError(
        `${fieldName} must be at least ${min}`,
        fieldName
      );
    }
    if (value > max) {
      throw new ValidationError(
        `${fieldName} must be no more than ${max}`,
        fieldName
      );
    }
    return true;
  },

  /**
   * Validates if a value is one of the allowed values
   * @param {*} value - Value to validate
   * @param {Array} allowedValues - Array of allowed values
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  oneOf(value, allowedValues, fieldName = 'field') {
    if (!allowedValues.includes(value)) {
      throw new ValidationError(
        `${fieldName} must be one of: ${allowedValues.join(', ')}`,
        fieldName
      );
    }
    return true;
  },

  /**
   * Validates email format
   * @param {string} value - Email to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  email(value, fieldName = 'email') {
    this.string(value, fieldName);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new ValidationError(
        `${fieldName} must be a valid email address`,
        fieldName
      );
    }
    return true;
  },

  /**
   * Validates UUID format
   * @param {string} value - UUID to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  uuid(value, fieldName = 'field') {
    this.string(value, fieldName);
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid UUID`, fieldName);
    }
    return true;
  },

  /**
   * Validates wallet address format (basic validation)
   * @param {string} value - Wallet address to validate
   * @param {string} fieldName - Name of the field for error messages
   * @returns {boolean} - True if valid
   */
  walletAddress(value, fieldName = 'walletAddress') {
    this.string(value, fieldName);
    if (value.length < 10) {
      throw new ValidationError(
        `${fieldName} must be a valid wallet address`,
        fieldName
      );
    }
    return true;
  },
};

/**
 * Schema-based validation functions
 */
export const schemaValidators = {
  /**
   * Validates an object against a schema definition
   * @param {Object} data - Data to validate
   * @param {Object} schema - Schema definition
   * @returns {ValidationResult} - Validation result
   */
  validateSchema(data, schema) {
    const result = new ValidationResult();

    try {
      // Validate required fields
      if (schema.required) {
        for (const field of schema.required) {
          try {
            validators.required(data[field], field);
          } catch (error) {
            result.addError(error.message, error.field, error.code);
          }
        }
      }

      // Validate field types and constraints
      if (schema.properties) {
        for (const [field, rules] of Object.entries(schema.properties)) {
          if (data[field] !== undefined) {
            try {
              this.validateField(data[field], rules, field);
            } catch (error) {
              result.addError(error.message, error.field, error.code);
            }
          }
        }
      }

      return result;
    } catch (error) {
      result.addError('Schema validation failed', null, 'SCHEMA_ERROR');
      return result;
    }
  },

  /**
   * Validates a single field against its rules
   * @param {*} value - Value to validate
   * @param {Object} rules - Validation rules
   * @param {string} fieldName - Name of the field
   * @returns {boolean} - True if valid
   */
  validateField(value, rules, fieldName) {
    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case 'string':
          validators.string(value, fieldName);
          if (rules.minLength !== undefined || rules.maxLength !== undefined) {
            validators.stringLength(
              value,
              rules.minLength,
              rules.maxLength,
              fieldName
            );
          }
          break;
        case 'number':
          validators.number(value, fieldName);
          if (rules.minimum !== undefined || rules.maximum !== undefined) {
            validators.numberRange(
              value,
              rules.minimum,
              rules.maximum,
              fieldName
            );
          }
          break;
        case 'integer':
          validators.integer(value, fieldName);
          if (rules.minimum !== undefined || rules.maximum !== undefined) {
            validators.numberRange(
              value,
              rules.minimum,
              rules.maximum,
              fieldName
            );
          }
          break;
        case 'boolean':
          validators.boolean(value, fieldName);
          break;
        case 'array':
          validators.array(value, fieldName);
          if (rules.minItems !== undefined && value.length < rules.minItems) {
            throw new ValidationError(
              `${fieldName} must have at least ${rules.minItems} items`,
              fieldName
            );
          }
          if (rules.maxItems !== undefined && value.length > rules.maxItems) {
            throw new ValidationError(
              `${fieldName} must have no more than ${rules.maxItems} items`,
              fieldName
            );
          }
          break;
        case 'object':
          validators.object(value, fieldName);
          break;
      }
    }

    // Enum validation
    if (rules.enum) {
      validators.oneOf(value, rules.enum, fieldName);
    }

    // Pattern validation (for strings)
    if (rules.pattern && typeof value === 'string') {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        throw new ValidationError(
          `${fieldName} does not match required pattern`,
          fieldName
        );
      }
    }

    return true;
  },
};

/**
 * Common validation schemas for Aqua Stark
 */
export const commonSchemas = {
  playerId: {
    type: 'string',
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 50,
  },

  walletAddress: {
    type: 'string',
    minLength: 10,
    maxLength: 100,
  },

  aquariumId: {
    type: 'string',
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 50,
  },

  fishId: {
    type: 'string',
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 50,
  },

  decorationId: {
    type: 'string',
    pattern: '^[a-zA-Z0-9_-]+$',
    minLength: 1,
    maxLength: 50,
  },

  happinessLevel: {
    type: 'integer',
    minimum: 0,
    maximum: 100,
  },

  position: {
    type: 'number',
    minimum: 0,
    maximum: 1000,
  },

  rotation: {
    type: 'number',
    minimum: 0,
    maximum: 360,
  },

  stock: {
    type: 'integer',
    minimum: 0,
  },

  price: {
    type: 'number',
    minimum: 0,
  },

  cleaningType: {
    type: 'string',
    enum: ['partial', 'complete'],
  },

  itemType: {
    type: 'string',
    enum: ['fish', 'decoration', 'food', 'other'],
  },
};

/**
 * Middleware factory for request validation
 * @param {Object} options - Validation options
 * @param {Object} options.body - Body validation schema
 * @param {Object} options.params - Params validation schema
 * @param {Object} options.query - Query validation schema
 * @param {boolean} options.logValidation - Whether to log validation attempts
 * @returns {Function} - Express middleware function
 */
export function createValidationMiddleware(options = {}) {
  const { body, params, query, logValidation = true } = options;

  return (req, res, next) => {
    const validationResult = new ValidationResult();
    const startTime = Date.now();

    try {
      // Validate request body
      if (body && req.body) {
        const bodyResult = schemaValidators.validateSchema(req.body, body);
        if (!bodyResult.isValid) {
          validationResult.errors.push(...bodyResult.errors);
        }
        validationResult.warnings.push(...bodyResult.warnings);
      }

      // Validate request parameters
      if (params && req.params) {
        const paramsResult = schemaValidators.validateSchema(
          req.params,
          params
        );
        if (!paramsResult.isValid) {
          validationResult.errors.push(...paramsResult.errors);
        }
        validationResult.warnings.push(...paramsResult.warnings);
      }

      // Validate query parameters
      if (query && req.query) {
        const queryResult = schemaValidators.validateSchema(req.query, query);
        if (!queryResult.isValid) {
          validationResult.errors.push(...queryResult.errors);
        }
        validationResult.warnings.push(...queryResult.warnings);
      }

      // Log validation attempt
      if (logValidation) {
        const duration = Date.now() - startTime;
        logger.info('Validation attempt', {
          method: req.method,
          url: req.url,
          duration: `${duration}ms`,
          errors: validationResult.errors.length,
          warnings: validationResult.warnings.length,
        });
      }

      // If validation failed, return error response
      if (!validationResult.isValid) {
        logger.warn('Validation failed', {
          method: req.method,
          url: req.url,
          errors: validationResult.errors,
        });

        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validationResult.errors,
          warnings: validationResult.warnings,
        });
      }

      // Add validation result to request for potential use in controllers
      req.validationResult = validationResult;

      // Continue to next middleware
      next();
    } catch (error) {
      logger.error('Validation middleware error', {
        method: req.method,
        url: req.url,
        error: error.message,
        stack: error.stack,
      });

      return res.status(500).json({
        success: false,
        error: 'Internal validation error',
        message: error.message,
      });
    }
  };
}

/**
 * Predefined validation middleware for common use cases
 */
export const validationMiddleware = {
  /**
   * Validates player ID parameter
   */
  validatePlayerId: createValidationMiddleware({
    params: {
      required: ['playerId'],
      properties: {
        playerId: commonSchemas.playerId,
      },
    },
  }),

  /**
   * Validates aquarium ID parameter
   */
  validateAquariumId: createValidationMiddleware({
    params: {
      required: ['aquariumId'],
      properties: {
        aquariumId: commonSchemas.aquariumId,
      },
    },
  }),

  /**
   * Validates fish ID parameter
   */
  validateFishId: createValidationMiddleware({
    params: {
      required: ['fishId'],
      properties: {
        fishId: commonSchemas.fishId,
      },
    },
  }),

  /**
   * Validates decoration ID parameter
   */
  validateDecorationId: createValidationMiddleware({
    params: {
      required: ['decorationId'],
      properties: {
        decorationId: commonSchemas.decorationId,
      },
    },
  }),

  /**
   * Validates fish happiness update
   */
  validateFishHappiness: createValidationMiddleware({
    body: {
      required: ['happinessLevel'],
      properties: {
        happinessLevel: commonSchemas.happinessLevel,
      },
    },
  }),

  /**
   * Validates fish feeding
   */
  validateFishFeeding: createValidationMiddleware({
    body: {
      properties: {
        foodType: {
          type: 'string',
          enum: ['regular', 'premium', 'basic'],
          default: 'regular',
        },
      },
    },
  }),

  /**
   * Validates decoration placement
   */
  validateDecorationPlacement: createValidationMiddleware({
    body: {
      required: ['aquariumId', 'positionX', 'positionY'],
      properties: {
        aquariumId: commonSchemas.aquariumId,
        positionX: commonSchemas.position,
        positionY: commonSchemas.position,
        rotationDegrees: commonSchemas.rotation,
      },
    },
  }),

  /**
   * Validates store item creation
   */
  validateStoreItemCreation: createValidationMiddleware({
    body: {
      required: ['name', 'description', 'price', 'type', 'image_url'],
      properties: {
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 100,
        },
        description: {
          type: 'string',
          minLength: 1,
          maxLength: 500,
        },
        price: commonSchemas.price,
        type: commonSchemas.itemType,
        image_url: {
          type: 'string',
          minLength: 1,
          maxLength: 500,
        },
        stock: commonSchemas.stock,
      },
    },
  }),

  /**
   * Validates dirt cleaning
   */
  validateDirtCleaning: createValidationMiddleware({
    body: {
      properties: {
        cleaning_type: commonSchemas.cleaningType,
      },
    },
  }),

  /**
   * Validates player creation
   */
  validatePlayerCreation: createValidationMiddleware({
    body: {
      required: ['playerId', 'walletAddress'],
      properties: {
        playerId: commonSchemas.playerId,
        walletAddress: commonSchemas.walletAddress,
        username: {
          type: 'string',
          minLength: 1,
          maxLength: 50,
        },
      },
    },
  }),
};

/**
 * Utility function to validate multiple fish IDs
 * @param {Array} fishIds - Array of fish IDs to validate
 * @returns {ValidationResult} - Validation result
 */
export function validateFishIds(fishIds) {
  const result = new ValidationResult();

  try {
    validators.array(fishIds, 'fishIds');
    validators.required(fishIds, 'fishIds');

    if (fishIds.length === 0) {
      result.addError('Fish IDs array cannot be empty', 'fishIds');
    }

    for (let i = 0; i < fishIds.length; i++) {
      try {
        validators.string(fishIds[i], `fishIds[${i}]`);
        if (fishIds[i].length < 1 || fishIds[i].length > 50) {
          result.addError(
            `Fish ID at index ${i} must be 1-50 characters long`,
            `fishIds[${i}]`
          );
        }
      } catch (error) {
        result.addError(error.message, error.field, error.code);
      }
    }

    return result;
  } catch (error) {
    result.addError(error.message, error.field, error.code);
    return result;
  }
}

/**
 * Utility function to validate ownership (for middleware use)
 * @param {string} resourceOwnerId - ID of the resource owner
 * @param {string} authenticatedUserId - ID of the authenticated user
 * @returns {ValidationResult} - Validation result
 */
export function validateOwnership(resourceOwnerId, authenticatedUserId) {
  const result = new ValidationResult();

  if (resourceOwnerId !== authenticatedUserId) {
    result.addError(
      'Access denied: You can only access your own resources',
      'ownership',
      'ACCESS_DENIED'
    );
  }

  return result;
}

export default {
  ValidationError,
  ValidationResult,
  validators,
  schemaValidators,
  commonSchemas,
  createValidationMiddleware,
  validationMiddleware,
  validateFishIds,
  validateOwnership,
};
