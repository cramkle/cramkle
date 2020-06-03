interface Options {
  onUpdate?: () => void
  onInstall?: () => void
}

const registerSW = ({ onUpdate, onInstall }: Options = {}) => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker.register('/service-worker.js').then((reg) => {
    if (!reg) {
      return
    }

    reg.onupdatefound = () => {
      const installingWorker = reg.installing
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            onUpdate?.()
          } else {
            onInstall?.()
          }
        }
      }
    }
  })
}

export default registerSW
