import './modules/img-load-state.js'
import './modules/lazy-load.js'
import './modules/transition-state.js'
import { throttle } from './modules/throttle.js'

const imagesCount = 42
const galleryElement = document.getElementById('gallery')
const popupElement = document.getElementById('popup')
const images = []
let lastImageIndex

const getImageSrc = (index, viewport = '800', category = 'architecture') => {
  index++
  return `./img/content/${category}-${index}-${viewport}.jpg`
}

const getImageSrcset = (index, category = 'architecture') => {
  index++
  return `./img/content/${category}-${index}-400.jpg 400w,
    ./img/content/${category}-${index}-800.jpg 800w,
    ./img/content/${category}-${index}-1200.jpg 1200w,
    ./img/content/${category}-${index}-1920.jpg 1920w`
}

const createImage = (src, srcset, dataSrc, dataSrcset, classList) => {
  const element = document.createElement('img')
  element.classList.add(...classList)
  element.src = src ?? ''
  element.srcset = srcset ?? ''
  element.draggable = false

  if (dataSrc) {
    element.dataset.src = dataSrc
    element.setAttribute('data-lazy', '')
  }

  if (dataSrcset) {
    element.dataset.srcset = dataSrcset
  }

  element.setAttribute('data-load', '')
  element.alt = 'Gallery image'
  return element
}

const renderImage = (src, srcset, dataSrc, dataSrcset, classList, container, focusable, onElementAction) => {
  let element = createImage(src, srcset, dataSrc, dataSrcset, classList)

  if (focusable) {
    const button = document.createElement('button')
    button.classList.add('image-btn')
    button.setAttribute('data-load-container', '')
    button.append(element)
    button.setAttribute('aria-label', 'Open full image')
    element = button
    images.push(element)
  }

  container.append(element)

  if (typeof onElementAction === 'function') {
    onElementAction(element)
  }
}

const isPopupClosed = () => !popupElement.classList.contains('is-shown')
const isPopupTransition = () => popupElement.classList.contains('is-transition')
const isImageLoaded = (element) => element.getAttribute('data-load-state') === 'loaded'

const openPopup = (index, element = images[index]) => {
  const isOpenAllowed = !isPopupTransition() && isPopupClosed() && isImageLoaded(element)

  if (isOpenAllowed) {
    element.blur()
    const src = getImageSrc(index)
    const srcset = getImageSrcset(index)
    renderImage(src, srcset, null, null, ['popup-img'], popupElement)
    popupElement.classList.add('is-shown')
    lastImageIndex = index
  }
}

const closePopup = () => {
  return new Promise((resolve) => {
    if (!isPopupClosed()) {
      popupElement.classList.remove('is-shown')

      popupElement.addEventListener(
        'transitionend',
        ({ target }) => {
          if (target === popupElement) {
            popupElement.innerHTML = ''
            resolve()
          }
        },
        {
          once: true,
        }
      )
    }
  })
}

const switchImage = throttle((isPrev) => {
  const isNext = !isPrev
  const isSwitchPrev = isPrev && lastImageIndex > 0
  const isSwitchNext = isNext && lastImageIndex < imagesCount - 1
  const isSwitch = isSwitchPrev || isSwitchNext

  if (isSwitchPrev) {
    lastImageIndex--
  }

  if (isSwitchNext) {
    lastImageIndex++
  }

  if (isSwitch) {
    closePopup().then(() => openPopup(lastImageIndex))
  }
}, 1000)

const addPopupListeners = () => {
  popupElement.addEventListener('click', () => {
    if (!isPopupClosed()) {
      closePopup()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (isPopupClosed()) {
      return
    }

    if (e.key === 'Escape') {
      closePopup()
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      switchImage(e.key === 'ArrowLeft')
    }
  })
}

const renderImages = () => {
  for (let i = 0; i < imagesCount; i++) {
    const src = ''
    const srcset = ''
    const dataSrc = getImageSrc(i)
    const dataSrcset = ''

    renderImage(src, srcset, dataSrc, dataSrcset, ['gallery-img'], galleryElement, true, (element) => {
      element.addEventListener('click', () => {
        openPopup(i, element)
      })
    })
  }
}

renderImages()
addPopupListeners()
