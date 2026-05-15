import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class Services {
  constructor() {
    this.cards = qsa('.service-card')
    this.header = qs('.services__header')
    this.init()
  }

  init() {
    // Header reveal
    gsap.from(this.header.children, {
      scrollTrigger: {
        trigger: this.header,
        start: 'top 80%'
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1
    })

    // Cards stagger
    gsap.from(this.cards, {
      scrollTrigger: {
        trigger: '.services__grid--8',
        start: 'top 80%'
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1
    })

    // 3D hover effect
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.onMouseMove(e, card))
      card.addEventListener('mouseleave', () => this.onMouseLeave(card))
    })
  }

  onMouseMove(e, card) {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateY = ((x - centerX) / centerX) * 8
    const rotateX = -((y - centerY) / centerY) * 8

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: 1.03,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000
    })
  }

  onMouseLeave(card) {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'expo.out'
    })
  }
}
