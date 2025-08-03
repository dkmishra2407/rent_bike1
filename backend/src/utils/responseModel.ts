export interface ApiResponse<T = any> {
    success: boolean;
    message: string | object;
    data?: T;
    error?: string | object;
  }
  
  export class ResponseModel {
    static success<T>(message: string, data?: T): ApiResponse<T> {
      return {
        success: true,
        message,
        data,
      };
    }
  
    static error(message: string | object, error?: string | object): ApiResponse {
      return {
        success: false,
        message,
        error,
      };
    }
  }
  