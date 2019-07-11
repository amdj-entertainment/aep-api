import { validationResult } from 'express-validator'
import { Types } from 'mongoose'
import Event from '../models/events.model'
export default {
  hasDashboard: (req, res, next) => {
    if (req.user.dashboard) return next()
    return res.status(401).json({ status: 401, message: 'Unauthorized' })
  },
  verifyRequest: async (req, res, next) => {
    const valid = await validationResult(req)
    if (!valid.isEmpty())
      return res.status(400).json({
        status: 400,
        message: valid.array().map((i) => i.msg),
        error: valid.array().map((i) => i.param),
      })
    return next()
  },
  verifyWorkspace: (eventID) => {
    return new Promise(async (resolve, reject) => {
      if (!Types.ObjectId.isValid(eventID)) reject('Invalid ObjectID')
      const event = await Event.findById(eventID).catch((err) => {
        reject(err)
      })
      if (event._workspaceID !== Types.ObjectId(req.user._workspaceID)) reject()
      resolve()
    })
  },
}
