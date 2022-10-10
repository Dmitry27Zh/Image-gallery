const SELECTOR = '[data-lazy][data-src]'

const load = (element) => {
  const src = element.getAttribute('data-src')
  const srcSet = element.getAttribute('data-srcset')
  element.src = src

  if (srcSet) {
    element.srcSet = srcSet
  }
}

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      load(entry.target)
      intersectionObserver.unobserve(entry.target)
    }
  })
})

const newElementsObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ addedNodes }) => {
    addedNodes.forEach((node) => {
      const element = node.matches(SELECTOR) ? node : node.querySelector?.(SELECTOR)

      if (element) {
        intersectionObserver.observe(element)
      }
    })
  })
})

const initLazyLoad = () => {
  const elements = document.querySelectorAll(SELECTOR)
  elements.forEach((element) => intersectionObserver.observe(element))

  newElementsObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

initLazyLoad()
