import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class About {
  constructor() {
    this.section = qs('#about')
    this.title = qs('.about__title')
    this.paragraphs = qsa('.about__text p')
    this.stats = qsa('.stat')
    this.statNumbers = qsa('.stat__number[data-count]')
    this.init()
  }

  init() {
    // Title reveal
    gsap.from(this.title, {
      scrollTrigger: {
        trigger: this.title,
        start: 'top 80%',
      },
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out'
    })

    // Paragraphs
    gsap.from(this.paragraphs, {
      scrollTrigger: {
        trigger: this.paragraphs[0],
        start: 'top 85%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.15
    })

    // Stats counter
    this.statNumbers.forEach(el => {
      const target = parseInt(el.dataset.count)
      const obj = { value: 0 }
      gsap.to(obj, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        value: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toLocaleString('fr-FR')
        }
      })
    })

    // 100% stat
    const suffixEl = qs('.stat__number[data-suffix]')
    if (suffixEl) {
      gsap.from(suffixEl, {
        scrollTrigger: { trigger: suffixEl, start: 'top 85%' },
        opacity: 0,
        duration: 1
      })
    }
  }
}
