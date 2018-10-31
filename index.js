const createApp = require('./createApp')

createApp().then(app => {
  const port = process.env.PORT || 5000

  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`App listening on https://localhost:${port}`)
  })
})
