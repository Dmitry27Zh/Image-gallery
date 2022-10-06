const imagesCount = 37
const galleryElement = document.getElementById('gallery')
const popupElement = document.getElementById('popup')
let lastImageIndex

const getImageSrc = (index, viewport = '800', category = 'architecture') => {
  return `./img/content/${category}-${index}-${viewport}.jpg`
}

const getImageSrcset = (index, category = 'architecture') => {
  return `./img/content/${category}-${index}-400.jpg 400w,
    ./img/content/${category}-${index}-800.jpg 800w,
    ./img/content/${category}-${index}-1200.jpg 1200w,
    ./img/content/${category}-${index}-1920.jpg 1920w`
}

const addLoadImageListeners = (element) => {
  element.addEventListener('load', () => {
    element.parentElement.classList.add('is-loaded')
  })

  element.addEventListener('error', () => {
    element.parentElement.classList.add('is-error')
  })
}

const createImage = (src, srcset, classList) => {
  const element = document.createElement('img')
  element.classList.add(...classList)
  element.src = src
  element.srcset = srcset
  element.alt = 'Gallery image'
  addLoadImageListeners(element)
  return element
}

const renderImage = (src, srcset, classList, container, focusable, onElementAction) => {
  let element = createImage(src, srcset, classList)

  if (focusable) {
    const button = document.createElement('button')
    button.classList.add('image-btn')
    button.append(element)
    button.setAttribute('aria-label', 'Open full image')
    element = button
  }

  container.append(element)

  if (typeof onElementAction === 'function') {
    onElementAction(element)
  }
}

const openPopup = (index) => {
  const src = getImageSrc(index)
  const srcset = getImageSrcset(index)
  renderImage(src, srcset, ['popup-img'], popupElement)
  popupElement.classList.add('is-shown')
  lastImageIndex = index
}

const closePopup = () => {
  if (popupElement.classList.contains('is-shown')) {
    popupElement.classList.remove('is-shown', 'is-loaded', 'is-error')
    popupElement.innerHTML = ''
  }
}

const switchImage = (isPrev) => {
  const isNext = !isPrev
  const isSwitchPrev = isPrev && lastImageIndex > 1
  const isSwitchNext = isNext && lastImageIndex < imagesCount
  const isSwitch = isSwitchPrev || isSwitchNext

  if (isSwitchPrev) {
    lastImageIndex--
  }

  if (isSwitchNext) {
    lastImageIndex++
  }

  if (isSwitch) {
    closePopup()
    openPopup(lastImageIndex)
  }
}

const isPopupClosed = () => !popupElement.classList.contains('is-shown')
const isImageLoaded = (element) => element.classList.contains('is-loaded')

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
  for (let i = 1; i <= imagesCount; i++) {
    const src = getImageSrc(i)
    const srcset = ''

    renderImage(src, srcset, ['gallery-img'], galleryElement, true, (element) => {
      element.addEventListener('click', () => {
        if (isPopupClosed() && isImageLoaded(element)) {
          element.blur()
          openPopup(i)
        }
      })
    })
  }
}

renderImages()
addPopupListeners()
