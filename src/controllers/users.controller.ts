import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator"
import { User } from "../models/User.model"

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUserId = req.session.passport?.user
    const bodyData = matchedData(req, { locations: ["body"] })
    if (requestingUserId) {
      const queryResult = await new User().updateById(
        requestingUserId.toString(),
        bodyData
      )

      const user = queryResult.rows[0]
      delete user.hash
      res.json(user)
    }
  } catch (error) {
    next(error)
  }
}

export { updateUser }
