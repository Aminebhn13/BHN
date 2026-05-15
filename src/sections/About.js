import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class About {
  constructor() {
    this.section = qs('#about')
    this.title = qs('.about__title')
    this.paragraphs = qsa('.about__text p')
    this.statsContainer = qs('.about__stats')
    this.init()
  }

  init() {
    if (this.title) {
      gsap.from(this.title, {
        scrollTrigger: { trigger: this.title, start: 'top 80%' },
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out'
      })
    }

    if (this.paragraphs.length) {
      gsap.from(this.paragraphs, {
        scrollTrigger: { trigger: this.paragraphs[0], start: 'top 85%' },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.15
      })
    }

    if (this.statsContainer) {
      ScrollTrigger.create({
        trigger: this.statsContainer,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const countEls = qsa('[data-count]')
          countEls.forEach(el => {
            const target = parseInt(el.dataset.count)
            const obj = { value: 0 }
            gsap.to(obj, {
              value: target,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(obj.value)
              }
            })
          })
        }
      })

      gsap.from(qsa('.stat'), {
        scrollTrigger: { trigger: this.statsContainer, start: 'top 85%' },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.1
      })
    }
  }
}
