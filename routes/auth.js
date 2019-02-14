const express = require('express')
const passport = require('passport')

const router = express.Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ id: req.user._id, username: req.user.username })
})

router.post('/logout', (req, res) => {
  req.logout()
  res.json({ ok: true })
})

module.exports = router
