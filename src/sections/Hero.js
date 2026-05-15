import gsap from 'gsap'
import { qs, qsa } from '../utils/dom.js'

export class Hero {
  constructor() {
    this.section = qs('#hero')
    this.lines = qsa('.hero__title .line')
    this.eyebrow = qsa('.hero__eyebrow .tag')
    this.sub = qs('.hero__sub')
    this.scrollCue = qs('.hero__scroll-cue')
    this.coords = qs('.hero__coords')
  }

  reveal() {
    const tl = gsap.timeline({ delay: 0.2 })

    tl.to(this.lines, {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.4,
      ease: 'expo.out',
      stagger: 0.12
    })

    tl.from(this.eyebrow, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.08
    }, '-=0.8')

    tl.from(this.sub, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out'
    }, '-=0.6')

    tl.from(this.scrollCue, {
      opacity: 0,
      duration: 0.6
    }, '-=0.4')

    tl.from(this.coords, {
      opacity: 0,
      duration: 0.6
    }, '<')

    return tl
  }
}
