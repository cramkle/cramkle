const express = require('express')

const fs = require('./middlewares/fs')
const server = require('./index')

const app = express()

app.use(fs())
app.use(server)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
