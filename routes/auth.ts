import { Router } from 'express'
import { authenticate } from 'passport'

const router = Router()

router.post('/login', authenticate('local'), (req, res) => {
  res.json({ id: req.user._id, username: req.user.username })
})

router.post('/logout', (req, res) => {
  req.logout()
  res.json({ ok: true })
})

export default router
