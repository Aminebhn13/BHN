import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class Contact {
  constructor() {
    this.title = qs('.contact__title')
    this.form = qs('.contact__form')
    this.fields = qsa('.field')
    this.info = qs('.contact__info')
    this.init()
  }

  init() {
    gsap.from(this.title, {
      scrollTrigger: { trigger: this.title, start: 'top 80%' },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out'
    })

    gsap.from(this.fields, {
      scrollTrigger: { trigger: this.form, start: 'top 80%' },
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.1
    })

    gsap.from(this.info && this.info.children ? [...this.info.children] : [], {
      scrollTrigger: { trigger: this.info, start: 'top 85%' },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.1
    })
  }
}
