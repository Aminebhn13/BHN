import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class Process {
  constructor() {
    this.lineFill = qs('.process__line-fill')
    this.steps = qsa('.step')
    this.header = qs('.process__header')
    this.init()
  }

  init() {
    // Header
    gsap.from(this.header.children, {
      scrollTrigger: { trigger: this.header, start: 'top 80%' },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1
    })

    // Line fill
    gsap.to(this.lineFill, {
      scrollTrigger: {
        trigger: '.process__timeline',
        start: 'top 70%',
        end: 'bottom 60%',
        scrub: 1
      },
      width: '100%',
      ease: 'none'
    })

    // Steps appear
    this.steps.forEach((step, i) => {
      gsap.from(step.querySelector('.step__content'), {
        scrollTrigger: {
          trigger: step,
          start: 'top 75%'
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        delay: i * 0.1
      })

      ScrollTrigger.create({
        trigger: step,
        start: 'top 70%',
        onEnter: () => step.classList.add('active')
      })
    })
  }
}
