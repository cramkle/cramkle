import mongoose from 'mongoose'

beforeAll(async () => {
  ;(global as any).mongoose = await mongoose.connect(
    process.env.MONGO_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
})

afterAll(async () => {
  await (global as any).mongoose.disconnect()
})
