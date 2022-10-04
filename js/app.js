const imagesCount = 15
const galleryElement = document.getElementById('gallery')

const createImage = (src) => {
  const element = document.createElement('img')
  element.classList.add('gallery-img')
  element.src = src
  element.setAttribute('tabindex', '0')
  return element
}

const renderImage = (index) => {
  const path = `./img/architecture-${index}.jpg`
  const imageElement = createImage(path)
  galleryElement.append(imageElement)
}

const renderImages = () => {
  for (let i = 1; i < imagesCount; i++) {
    renderImage(i)
  }
}

renderImages()
