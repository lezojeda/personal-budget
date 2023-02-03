import { Request, Response, NextFunction } from "express"
import { matchedData } from "express-validator"
import { User } from "../models/User.model"

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestingUserId = req.session.passport?.user
    const bodyData = matchedData(req, { locations: ["body"] })
    if (requestingUserId) {
      const updatedUser = await new User().updateById(
        requestingUserId.toString(),
        bodyData
      )
      delete updatedUser.hash
      res.json(updatedUser)
    }
  } catch (error) {
    next(error)
  }
}

export { updateUser }
