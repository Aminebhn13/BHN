import gsap from 'gsap'
import { qs } from '../utils/dom.js'

export class Manifesto {
  constructor() {
    this.inner = qs('.manifesto__inner')
    this.tween = null
    this.init()
  }

  init() {
    this.tween = gsap.to(this.inner, {
      x: '-=50%',
      duration: 25,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (this.inner.scrollWidth / 3))
      }
    })

    // Speed up/slow down based on scroll velocity
    let lastScrollY = 0
    window.addEventListener('scroll', () => {
      const delta = window.scrollY - lastScrollY
      lastScrollY = window.scrollY
      const speed = Math.abs(delta) > 5 ? 0.6 : 1
      gsap.to(this.tween, { timeScale: speed, duration: 0.5, ease: 'power2.out' })
    })
  }
}
