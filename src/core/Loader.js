import gsap from 'gsap'
import { qs } from '../utils/dom.js'

export class Loader {
  constructor() {
    this.el = qs('#loader')
    this.bar = qs('.loader__bar')
    this.percent = qs('.loader__percent')
    this.logo = qs('.loader__logo')
    this.tagline = qs('.loader__tagline')
    this.progress = { value: 0 }
  }

  start() {
    return new Promise((resolve) => {
      const tl = gsap.timeline()

      tl.to(this.progress, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
          const v = Math.round(this.progress.value)
          this.bar.style.width = v + '%'
          this.percent.textContent = v + '%'
        }
      })

      tl.to(this.logo, {
        y: -60,
        opacity: 0,
        duration: 0.6,
        ease: 'expo.in'
      }, '+=0.2')

      tl.to(this.percent, {
        opacity: 0,
        duration: 0.3,
      }, '<')

      tl.to(this.tagline, {
        opacity: 0,
        duration: 0.3,
      }, '<')

      tl.to(this.el, {
        yPercent: -100,
        duration: 1.2,
        ease: 'expo.inOut',
        onComplete: () => {
          this.el.style.display = 'none'
          resolve()
        }
      })
    })
  }
}
