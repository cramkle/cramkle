export default class Emitter<T> {
  private listeners = new Set<(event: T) => void>()

  public event = (callback: (event: T) => void) => {
    this.listeners.add(callback)

    return () => {
      this.listeners.delete(callback)
    }
  }

  public emit = (event: T) => {
    this.listeners.forEach(callback => {
      callback(event)
    })
  }
}
