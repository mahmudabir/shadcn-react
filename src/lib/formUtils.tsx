import { Result } from "@/app/core/models/result.ts";
import type { FieldErrors } from "react-hook-form";

const ENABLE_LOGGING = true;

// Console-only logging utility with beautiful formatting
class FormLogger {
  public static styles = {
    header: 'color: #2563eb; font-weight: bold; font-size: 16px;',
    success: 'color: #059669; font-weight: bold;',
    error: 'color: #dc2626; font-weight: bold;',
    warning: 'color: #d97706; font-weight: bold;',
    info: 'color: #0891b2; font-weight: bold;',
    field: 'color: #7c3aed; font-weight: 600;',
    value: 'color: #374151;',
    muted: 'color: #6b7280;'
  };

  static logFormState(title: string, formValues: any, errors: FieldErrors) {
    if (!ENABLE_LOGGING) return;

    console.clear();

    const timestamp = new Date().toLocaleTimeString();
    const border = '━'.repeat(60);

    console.log(`%c${title} - ${timestamp}`, this.styles.header);

    // Log form values
    this.logFormValues(formValues);
    // console.log('');

    // Log form errors
    this.logFormErrors(errors);
  }

  private static logFormValues(formValues: any) {
    const valueCount = formValues && typeof formValues === 'object' ? Object.keys(formValues).length : 0;

    console.group(`%c📝 Form Values (${valueCount} field${valueCount !== 1 ? 's' : ''})`, this.styles.success);

    if (!formValues) {
      console.log(`%c⚠️ Form values are undefined or null`, this.styles.warning);
    } else if (typeof formValues === 'object' && formValues !== null) {
      // Show flattened table view first
      const flattenedData = this.flattenObjectForTable(formValues);
      if (Object.keys(flattenedData).length > 0) {
        console.log(`%c📊 Table View:`, this.styles.info);
        console.table(flattenedData);
        // console.log('');
      }

      // Show detailed structure
      console.group(`%c🔗 Detailed Structure:`, this.styles.info);
      this.logObjectRecursive(formValues, '', 0);
      console.groupEnd();
      console.log('%c🔍 Raw JSON Data:', this.styles.info, formValues);
    } else {
      console.log(`%c📄 Form values: ${JSON.stringify(formValues)}`, this.styles.value);
    }

    console.groupEnd();
  }

  private static logFormErrors(errors: FieldErrors) {
    const errorCount = Object.keys(errors).length;

    if (errorCount === 0) {
      console.log(`%c✅ No Validation Errors - All fields are valid!`, this.styles.success);
      return;
    }

    console.group(`%c🚨 Validation Errors (${errorCount} field${errorCount !== 1 ? 's' : ''})`, this.styles.error);
    this.logErrorsRecursive(errors, '', 0);
    console.groupEnd();
  }

  private static logObjectRecursive(obj: any, path: string = '', depth: number = 0) {
    const indent = '  '.repeat(depth);
    const maxDepth = 5; // Prevent infinite recursion

    if (depth > maxDepth) {
      console.log(`%c${indent}[Max depth reached]`, this.styles.muted);
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const fieldStyle = depth === 0 ? this.styles.field : this.styles.info;

      if (value === null || value === undefined) {
        console.log(`%c${indent}${key}: %c${value}`, fieldStyle, this.styles.muted);
      } else if (Array.isArray(value)) {
        console.log(`%c${indent}${key}: %c[${value.length} item${value.length !== 1 ? 's' : ''}]`,
          fieldStyle, this.styles.info);

        if (value.length > 0) {
          console.group(`%c📋 ${currentPath} Array Items:`, this.styles.info);
          value.forEach((item, index) => {
            const arrayPath = `${currentPath}[${index}]`;
            console.log(`%c  [${index}]:`, this.styles.field);

            if (typeof item === 'object' && item !== null) {
              this.logObjectRecursive(item, arrayPath, depth + 2);
            } else {
              console.log(`%c    ${JSON.stringify(item)}`, this.styles.value);
            }
          });
          console.groupEnd();
        }
      } else if (typeof value === 'object' && value !== null) {
        console.log(`%c${indent}${key}: %c[Object]`, fieldStyle, this.styles.info);
        console.group(`%c🔗 ${currentPath} Properties:`, this.styles.info);
        this.logObjectRecursive(value, currentPath, depth + 1);
        console.groupEnd();
      } else if (typeof value === 'string') {
        const displayValue = value.length > 50 ? `${value.substring(0, 50)}...` : value;
        console.log(`%c${indent}${key}: %c"${displayValue}"`, fieldStyle, this.styles.value);
      } else {
        console.log(`%c${indent}${key}: %c${JSON.stringify(value)}`, fieldStyle, this.styles.value);
      }
    });
  }

  private static logErrorsRecursive(errors: FieldErrors, path: string = '', depth: number = 0) {
    const indent = '  '.repeat(depth);

    Object.entries(errors).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (!value) return;

      if (value?.message) {
        console.log(`%c${indent}❌ ${currentPath}: %c${value.message}`,
          this.styles.error, this.styles.value);

        if (value.type) {
          console.log(`%c${indent}   Type: ${value.type}`, this.styles.muted);
        }
      }

      if (typeof value === "object" && value) {
        if (Array.isArray(value)) {
          console.log(`%c${indent}📋 ${currentPath}: Array field with ${value.length} error${value.length !== 1 ? 's' : ''}`,
            this.styles.warning);
          value.forEach((item, index) => {
            if (item && typeof item === 'object') {
              console.group(`%c[${index}] ${currentPath}[${index}]:`, this.styles.warning);
              this.logErrorsRecursive(item, `${currentPath}[${index}]`, depth + 1);
              console.groupEnd();
            }
          });
        } else if (typeof value === "object" && !value?.message) {
          console.log(`%c${indent}🔗 ${currentPath}: Nested object with validation errors`,
            this.styles.warning);
          console.group(`%c${currentPath} Errors:`, this.styles.warning);
          this.logErrorsRecursive(value as FieldErrors, currentPath, depth + 1);
          console.groupEnd();
        }
      }
    });
  }

  static logTable(title: string, data: Record<string, any>) {
    if (!ENABLE_LOGGING) return;
    console.log(`%c📊 ${title}`, this.styles.header);
    console.table(data);
  }

  private static flattenObjectForTable(obj: any, prefix: string = '', result: Record<string, any> = {}): Record<string, any> {
    if (!obj || typeof obj !== 'object') return result;

    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value === null || value === undefined) {
        result[newKey] = {
          Value: value,
          Type: value === null ? 'null' : 'undefined',
          // Length: '-'
        };
      } else if (Array.isArray(value)) {
        result[newKey] = {
          Value: `[${value.length} items]`,
          Type: 'Array',
          // Length: value.length
        };

        // Show array items in table format
        value.forEach((item, index) => {
          const arrayKey = `${newKey}[${index}]`;
          if (typeof item === 'object' && item !== null) {
            this.flattenObjectForTable(item, arrayKey, result);
          } else {
            result[arrayKey] = {
              Value: this.formatValueForTable(item),
              Type: Array.isArray(item) ? 'Array' : typeof item,
              // Length: typeof item === 'string' ? item.length : '-'
            };
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        result[newKey] = {
          Value: '[Object]',
          Type: 'Object',
          // Length: Object.keys(value).length + ' props'
        };
        // Recursively flatten nested objects
        this.flattenObjectForTable(value, newKey, result);
      } else {
        result[newKey] = {
          Value: this.formatValueForTable(value),
          Type: typeof value,
          // Length: typeof value === 'string' ? value.length : '-'
        };
      }
    });

    return result;
  }

  private static formatValueForTable(value: any): string {
    if (typeof value === 'string') {
      return value.length > 100 ? `"${value.substring(0, 100)}..."` : `"${value}"`;
    }
    if (typeof value === 'boolean') {
      return value ? '✓ true' : '✗ false';
    }
    return String(value);
  }
}

export function logFormState(formValues: any, errors: FieldErrors, title: string = "📋 Form State") {
  FormLogger.logFormState(title, formValues, errors);
}

export function onSubmitTest(data: any) {
  if (!ENABLE_LOGGING) return;

  console.clear();
  const timestamp = new Date().toLocaleTimeString();
  const border = '═'.repeat(50);

  console.log(`%c${border}`, FormLogger.styles.success);
  console.log(`%c🎯 FORM SUBMISSION - ${timestamp}`, FormLogger.styles.success);
  console.log(`%c${border}`, FormLogger.styles.success);

  console.log(`%c✅ Form submitted successfully!`, FormLogger.styles.success);

  if (data && typeof data === 'object') {
    const fieldCount = Object.keys(data).length;
    console.log(`%c📊 Submitted ${fieldCount} field${fieldCount !== 1 ? 's' : ''}`, FormLogger.styles.info);

    // Show table view first
    const flattenedData = FormLogger['flattenObjectForTable'](data);
    console.log(`%c📋 Submitted Data Table:`, FormLogger.styles.info);
    console.table(flattenedData);

    console.group(`%c🔗 Detailed Structure:`, FormLogger.styles.info);
    FormLogger['logObjectRecursive'](data, '', 0);
    console.groupEnd();

    console.log(`%c🔍 Raw JSON Data:`, FormLogger.styles.info);
    console.log(data);
  } else {
    console.log(`%c📄 Submitted data: ${JSON.stringify(data)}`, FormLogger.styles.info);
  }
}

export function getErrorMessages(result: Result<any>) {
  return Object.entries(result.errors)
    .map(([property, messages], index) => `• ${messages.join(' • ')}`)
    .join(' \n• ');
}