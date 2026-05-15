import { lerp } from '../utils/math.js'
import { qs, qsa } from '../utils/dom.js'

const TRAIL_LENGTH = 8

export class Cursor {
  constructor() {
    this.el = qs('#cursor')
    this.outer = qs('.cursor__outer')
    this.inner = qs('.cursor__inner')
    this.text = qs('.cursor__text')
    this.mouse = { x: 0, y: 0 }
    this.pos = { x: 0, y: 0 }
    this.trail = []
    this.initTrail()
    this.init()
  }

  initTrail() {
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const dot = document.createElement('div')
      dot.className = 'cursor__trail-dot'
      const size = Math.max(2, 8 - i)
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        opacity: ${Math.max(0.05, 1 - i * 0.13)};
        background: ${i < 4 ? '#00f5ff' : '#8800ff'};
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9997;
        transform: translate(-50%, -50%);
        will-change: transform;
        transition: none;
      `
      document.body.appendChild(dot)
      this.trail.push({ el: dot, x: 0, y: 0, lerpFactor: Math.max(0.05, 0.3 - i * 0.03) })
    }
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
      this.inner.style.left = e.clientX + 'px'
      this.inner.style.top = e.clientY + 'px'
    })

    this.bindHover()
  }

  bindHover() {
    const hoverEls = qsa('a, button, .service-card, .mode-card, [data-cursor]')
    hoverEls.forEach(el => {
      if (el.dataset.cursorBound) return
      el.dataset.cursorBound = true
      el.addEventListener('mouseenter', () => this.onHoverIn(el))
      el.addEventListener('mouseleave', () => this.onHoverOut())
    })
  }

  onHoverIn(el) {
    this.outer.style.width = '70px'
    this.outer.style.height = '70px'
    this.outer.style.background = 'rgba(0,245,255,0.1)'
    this.inner.style.opacity = '0'

    if (el.classList.contains('btn-submit')) {
      this.text.textContent = 'ENVOYER'
      this.text.style.opacity = '1'
    }
  }

  onHoverOut() {
    this.outer.style.width = '40px'
    this.outer.style.height = '40px'
    this.outer.style.background = 'transparent'
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

    // Update trail
    let prevX = this.mouse.x
    let prevY = this.mouse.y
    this.trail.forEach((point) => {
      point.x = lerp(point.x, prevX, point.lerpFactor)
      point.y = lerp(point.y, prevY, point.lerpFactor)
      point.el.style.left = point.x + 'px'
      point.el.style.top = point.y + 'px'
      prevX = point.x
      prevY = point.y
    })
  }
}
