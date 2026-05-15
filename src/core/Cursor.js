import { lerp } from '../utils/math.js'
import { qs, qsa } from '../utils/dom.js'

export class Cursor {
  constructor() {
    this.el = qs('#cursor')
    this.outer = qs('.cursor__outer')
    this.inner = qs('.cursor__inner')
    this.text = qs('.cursor__text')
    this.mouse = { x: 0, y: 0 }
    this.pos = { x: 0, y: 0 }
    this.init()
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
      this.inner.style.left = e.clientX + 'px'
      this.inner.style.top = e.clientY + 'px'
    })

    // Hover effects
    const hoverEls = qsa('a, button, .service-card, [data-cursor]')
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => this.onHoverIn(el))
      el.addEventListener('mouseleave', () => this.onHoverOut())
    })

    // Observe DOM for new elements (services loaded later)
    const observer = new MutationObserver(() => this.bindHover())
    observer.observe(document.body, { childList: true, subtree: true })
  }

  bindHover() {
    const hoverEls = qsa('a:not([data-cursor-bound]), button:not([data-cursor-bound]), .service-card:not([data-cursor-bound])')
    hoverEls.forEach(el => {
      el.dataset.cursorBound = true
      el.addEventListener('mouseenter', () => this.onHoverIn(el))
      el.addEventListener('mouseleave', () => this.onHoverOut())
    })
  }

  onHoverIn(el) {
    this.outer.classList.add('cursor--hover')
    this.outer.style.width = '70px'
    this.outer.style.height = '70px'
    this.inner.style.opacity = '0'

    if (el.classList.contains('btn-submit')) {
      this.text.textContent = 'ENVOYER'
      this.text.style.opacity = '1'
    }
  }

  onHoverOut() {
    this.outer.classList.remove('cursor--hover')
    this.outer.style.width = '40px'
    this.outer.style.height = '40px'
    this.inner.style.opacity = '1'
    this.text.style.opacity = '0'
  }

  update() {
    this.pos.x = lerp(this.pos.x, this.mouse.x, 0.12)
    this.pos.y = lerp(this.pos.y, this.mouse.y, 0.12)
    this.outer.style.left = this.pos.x + 'px'
    this.outer.style.top = this.pos.y + 'px'
    this.text.style.left = this.pos.x + 'px'
    this.text.style.top = this.pos.y + 'px'
  }
}
