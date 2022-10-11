const SELECTOR = '[data-transition]'
const STATE_CLASS = 'is-transition'

const initTransitionState = () => {
  document.addEventListener(
    'transitionstart',
    ({ target }) => {
      if (target.matches(SELECTOR)) {
        target.classList.add(STATE_CLASS)
      }
    },
    true
  )

  document.addEventListener(
    'transitionend',
    ({ target }) => {
      if (target.matches(SELECTOR)) {
        target.classList.remove(STATE_CLASS)
      }
    },
    true
  )
}

initTransitionState()
