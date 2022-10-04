const imagesCount = 15
const galleryElement = document.getElementById('gallery')
const popupElement = document.getElementById('popup')

const createImage = (src, classList, focusable) => {
  const element = document.createElement('img')
  element.classList.add(...classList)
  element.src = src

  if (focusable) {
    element.setAttribute('tabindex', '0')
  }

  return element
}

const renderImage = (src, classList, container, onImageElementAction) => {
  const imageElement = createImage(src, classList, true)
  container.append(imageElement)

  if (typeof onImageElementAction === 'function') {
    onImageElementAction(imageElement)
  }
}

const openPopup = (src) => {
  renderImage(src, ['popup-img'], popupElement)
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
    const src = `./img/architecture-${i}.jpg`

    renderImage(src, ['gallery-img'], galleryElement, (imageElement) => {
      imageElement.addEventListener('click', () => {
        openPopup(src)
      })
    })
  }
}

renderImages()
addPopupListeners()
