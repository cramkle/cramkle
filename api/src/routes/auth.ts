import { Router } from 'express'
import { authenticate } from 'passport'

import { UserModel } from '../mongo'

const router = Router()

router.post('/login', authenticate('local'), (req, res) => {
  UserModel.findByIdAndUpdate(req.user!._id, { lastLogin: new Date() }, () => {
    res.json({ id: req.user!._id, username: req.user!.username })
  })
})

router.post('/logout', (req, res) => {
  req.logout()
  res.json({ ok: true })
})

export default router
