class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'Unauthorized error'
  }
}

module.exports = {
  UnauthorizedError,
}
