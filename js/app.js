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

const createImage = (src, srcset, classList, focusable) => {
  const element = document.createElement('img')
  element.classList.add(...classList)
  element.src = src
  element.srcset = srcset

  if (focusable) {
    element.setAttribute('tabindex', '0')
  }

  return element
}

const renderImage = (src, srcset, classList, container, onImageElementAction) => {
  const imageElement = createImage(src, srcset, classList, true)
  container.append(imageElement)

  if (typeof onImageElementAction === 'function') {
    onImageElementAction(imageElement)
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

    renderImage(src, srcset, ['gallery-img'], galleryElement, (imageElement) => {
      imageElement.addEventListener('click', () => {
        openPopup(i)
      })
    })
  }
}

renderImages()
addPopupListeners()
