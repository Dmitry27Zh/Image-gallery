const STATE_ATTRIBUTE = 'data-load-state'

const ElementSelector = {
  ELEMENT: 'img[data-load]',
  CONTAINER: '[data-load-container]',
}

const State = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
}

const listenedElements = new WeakSet()
const getContainer = (element) => element.closest(ElementSelector.CONTAINER) || element

const addListeners = (element, container) => {
  if (listenedElements.has(element)) {
    return
  }

  element.addEventListener('load', () => {
    container.setAttribute(STATE_ATTRIBUTE, State.LOADED)
  })

  element.addEventListener('error', () => {
    container.setAttribute(STATE_ATTRIBUTE, State.ERROR)
  })

  const removeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      const isElementRemoved = [...mutation.removedNodes].some((node) => node.matches?.(ElementSelector.ELEMENT))

      if (isElementRemoved) {
        container.removeAttribute(STATE_ATTRIBUTE)
      }
    })
  })

  const sourceChangeObserver = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      container.setAttribute(STATE_ATTRIBUTE, State.LOADING)
    })
  })

  if (container !== element) {
    removeObserver.observe(container, {
      childList: true,
      subtree: true,
    })
  }

  sourceChangeObserver.observe(element, {
    attributes: true,
    attributeFilter: ['src', 'srcset'],
  })

  listenedElements.add(element)
}

const initElement = (element) => {
  const container = getContainer(element)

  if (element.complete) {
    const state = element.naturalWidth !== 0 ? State.LOADED : State.ERROR
    container.setAttribute(STATE_ATTRIBUTE, state)
  } else {
    container.setAttribute(STATE_ATTRIBUTE, State.LOADING)
  }

  addListeners(element, container)
}

const newElementsObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      const element = node.matches?.(ElementSelector.ELEMENT) ? node : node.querySelector?.(ElementSelector.ELEMENT)

      if (element) {
        initElement(element)
      }
    })
  })
})

const initImgLoadState = () => {
  const elements = [...document.querySelectorAll(ElementSelector.ELEMENT)]
  elements.forEach(initElement)

  newElementsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

initImgLoadState()
