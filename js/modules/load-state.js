const NodeSelector = {
  ELEMENT: '[data-load]',
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

  const removeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isElementRemoved = [...mutation.removedNodes].some((node) => node.matches?.(NodeSelector.ELEMENT))

      if (isElementRemoved) {
        container.classList.remove(...Object.values(StateClass))
      }
    })
  })

  removeObserver.observe(container, {
    childList: true,
    subtree: true,
  })
}

const newElementsObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      const element = node.matches?.(NodeSelector.ELEMENT) ? node : node.querySelector?.(NodeSelector.ELEMENT)

      if (element) {
        addListeners(element)
      }
    })
  })
})

const initImgLoadState = () => {
  const elements = document.querySelectorAll(NodeSelector.ELEMENT)
  elements.forEach(addListeners)

  newElementsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

initImgLoadState()
