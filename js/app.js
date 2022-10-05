const imagesCount = 15
const galleryElement = document.getElementById('gallery')
const popupElement = document.getElementById('popup')

const getImageSrc = (index, viewport = '800', category = 'architecture') => {
  return `./img/${category}-${index}-${viewport}.jpg`
}

const getImageSrcset = (index, category = 'architecture') => {
  return `./img/${category}-${index}-400.jpg 400w,
    ./img/${category}-${index}-800.jpg 800w,
    ./img/${category}-${index}-1200.jpg 1200w,
    ./img/${category}-${index}-1920.jpg 1920w`
}

const createImage = (src, srcset, classList) => {
  const element = document.createElement('img')
  element.classList.add(...classList)
  element.src = src
  element.srcset = srcset
  element.alt = 'Gallery image'
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
}

const closePopup = () => {
  if (popupElement.classList.contains('is-shown')) {
    popupElement.classList.remove('is-shown')
    popupElement.innerHTML = ''
  }
}

const isPopupClosed = () => !popupElement.classList.contains('is-shown')

const addPopupListeners = () => {
  popupElement.addEventListener('click', () => {
    closePopup()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePopup()
    }
  })
}

const renderImages = () => {
  for (let i = 1; i <= imagesCount; i++) {
    const src = getImageSrc(i)
    const srcset = ''

    renderImage(src, srcset, ['gallery-img'], galleryElement, true, (imageElement) => {
      imageElement.addEventListener('click', () => {
        if (isPopupClosed()) {
          imageElement.blur()
          openPopup(i)
        }
      })
    })
  }
}

renderImages()
addPopupListeners()
