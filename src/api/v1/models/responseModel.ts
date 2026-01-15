export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

export const successResponse = <T>(data?: T, message?: string): ApiResponse<T> => ({
  status: "success",
  data,
  message,
});

export const errorResponse = (message: string, code?: string): ApiResponse<null> => ({
  status: "error",
  message,
  code,
});
