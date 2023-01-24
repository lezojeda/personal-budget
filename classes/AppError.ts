import { StatusCodes } from "http-status-codes"

interface AppErrorArgs {
  name?: string
  httpStatusCode: StatusCodes
  message: string
  isOperational?: boolean
}

export class AppError extends Error {
  public readonly name: string
  public readonly httpStatusCode: StatusCodes

  /**
   * Determines if this error is a serious mistake. 
   * Setting it to true means that the error is normal 
   * and the user should receive an explanation what caused it.
   */
  public readonly isOperational: boolean = true

  constructor(args: AppErrorArgs) {
    super(args.message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.name = args.name || "Error"
    this.httpStatusCode = args.httpStatusCode

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational
    }

    Error.captureStackTrace(this)
  }
}
