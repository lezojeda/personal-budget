declare module "express-session" {
  export interface SessionData {
    passport: {
      user: number
    }
  }
}
