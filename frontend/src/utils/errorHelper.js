/**
 * Normalizes backend error responses into user-friendly strings.
 * Handles Express-Validator error arrays, Prisma constraint messages,
 * and generic Axios network errors.
 */
export const extractApiError = (error) => {
  if (!error) return 'An unexpected error occurred.';

  // If error has a response from Express backend
  if (error.response && error.response.data) {
    const data = error.response.data;

    // Express-validator errors array
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      return firstError.msg || firstError.message || data.message || 'Validation error.';
    }

    // Direct error message from backend apiResponse helper
    if (data.message) {
      return data.message;
    }
  }

  // Network or timeout errors
  if (error.request && !error.response) {
    return 'Unable to reach the server. Please check your connection or ensure backend is running.';
  }

  return error.message || 'An unexpected error occurred.';
};
