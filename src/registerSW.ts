interface Options {
  onUpdate?: () => void
  onInstall?: () => void
}

const registerSW = ({ onUpdate, onInstall }: Options = {}) => {
  if (!('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker
    .register('/service-worker.js')
    .then((reg) => {
      if (!reg) {
        return
      }

      reg.onupdatefound = () => {
        const installingWorker = reg.installing

        if (!installingWorker) {
          return
        }

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
    .catch((err) => {
      console.warn('Error registering service worker', err)
    })
}

export default registerSW
