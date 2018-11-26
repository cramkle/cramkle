const express = require('express')

const server = require('./index')

const app = express()

app.use(server)

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
