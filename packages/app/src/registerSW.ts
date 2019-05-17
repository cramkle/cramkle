interface Options {
  onUpdate?: () => void
  onInstall?: () => void
}

const registerSW = ({ onUpdate, onInstall }: Options = {}) => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/service-worker.js')
  }

  navigator.serviceWorker.getRegistration().then(reg => {
    if (!reg) {
      return
    }

    reg.onupdatefound = () => {
      const installingWorker = reg.installing
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            onUpdate && onUpdate()
          } else {
            onInstall && onInstall()
          }
        }
      }
    }
  })
}

export default registerSW
