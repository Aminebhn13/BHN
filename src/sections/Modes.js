import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class Modes {
  constructor() {
    this.section = qs('#modes')
    if (!this.section) return
    this.title = qs('.modes__title')
    this.cards = qsa('.mode-card')
    this.init()
  }

  init() {
    if (this.title) {
      gsap.from(this.title, {
        scrollTrigger: { trigger: this.title, start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      })
    }

    if (this.cards.length) {
      gsap.from(this.cards, {
        scrollTrigger: { trigger: '.modes__grid', start: 'top 80%' },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.15
      })
    }
  }
}
