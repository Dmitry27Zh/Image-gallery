const NodeSelector = {
  IMG: 'img[data-load]',
  CONTAINER: '[data-load-container]',
}

const StateClass = {
  LOADED: 'is-loaded',
  ERROR: 'is-error',
}

const addListeners = (element) => {
  const container = element.closest(NodeSelector.CONTAINER)

  element.addEventListener('load', () => {
    container.classList.add(StateClass.LOADED)
  })

  element.addEventListener('error', () => {
    container.classList.add(StateClass.ERROR)
  })
}

const newImagesObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      const imgElement = node.matches?.(NodeSelector.IMG) ? node : node.querySelector?.(NodeSelector.IMG)

      if (imgElement) {
        addListeners(imgElement)
      }
    })
  })
})

const initImgLoadState = () => {
  const elements = document.querySelectorAll(NodeSelector.IMG)
  elements.forEach(addListeners)

  newImagesObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

initImgLoadState()
