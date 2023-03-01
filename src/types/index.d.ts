// eslint-disable-next-line @typescript-eslint/no-unused-vars
/**
 * Lets use use express-session as a ES6 module
 */
import session from "express-session"

declare module "express-session" {
  export interface SessionData {
    passport: {
      user: number
    }
  }
}
