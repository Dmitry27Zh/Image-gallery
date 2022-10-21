const SELECTOR = '[data-lazy][data-src]'
const settings = {
  threshold: '0.5',
  rootMargin: '0px',
}

const load = (element) => {
  const src = element.getAttribute('data-src')
  const srcSet = element.getAttribute('data-srcset')
  element.src = src

  if (srcSet) {
    element.srcSet = srcSet
  }

  element.addEventListener('load', () => element.classList.add('lazy-loaded'))
}

const initLoad = (element) => {
  const condition1 = new Promise((resolve) => {
    if (element.complete) {
      resolve()
    }
  })

  const condition2 = new Promise((resolve) => {
    element.addEventListener('load', () => resolve())
  })

  const condition3 = new Promise((resolve) => {
    element.addEventListener('error', () => resolve())
  })

  Promise.race([condition1, condition2, condition3]).then(() => load(element))
}

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      initLoad(entry.target)
      intersectionObserver.unobserve(entry.target)
    }
  })
}, settings)

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
