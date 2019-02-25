class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Unauthorized error'
  }
}

export default {
  UnauthorizedError,
}
