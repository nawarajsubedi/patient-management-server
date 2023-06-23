export enum HttpCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  UPROCESSABLE_CONTENT = 422,
  INTERNAL_SERVER_ERROR = 500,
}
export enum MessageEnums {
  CSV_UPLOAD_ERROR = "Error occurred while uploading csv data",
  NO_RECORD_FOUND = "No record found",
}

interface AppErrorArgs {
  name?: string;
  httpCode: number;
  message: string;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpCode;
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || "Error";
    this.httpCode = args.httpCode;
    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }
    Error.captureStackTrace(this);
  }

  public static badRequest(message: string) {
    return new AppError({ httpCode: HttpCode.BAD_REQUEST, message });
  }

  public static notFound(message: string) {
    return new AppError({ httpCode: HttpCode.NOT_FOUND, message });
  }

  public static unauthorized(message: string) {
    return new AppError({ httpCode: HttpCode.UNAUTHORIZED, message });
  }

  public static internalServerError(message: string) {
    return new AppError({ httpCode: HttpCode.INTERNAL_SERVER_ERROR, message });
  }
}
