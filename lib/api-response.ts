export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}

export function errorResponse(error: string, statusCode?: number): ApiResponse {
  return {
    success: false,
    error
  };
}

export function createResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(successResponse(data)), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function createErrorResponse(error: string, status: number = 400): Response {
  return new Response(JSON.stringify(errorResponse(error)), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}