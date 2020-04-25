import mongoose, { Mongoose } from 'mongoose'

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/cramkle'

let connection: Mongoose | null = null

export const getConnection = async () => {
  if (connection !== null) {
    return connection
  }

  try {
    // eslint-disable-next-line require-atomic-updates
    connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    return connection
  } catch (err) {
    console.error('Failed to obtain a connection to MongoDB')
    console.error(err)
    throw err
  }
}
