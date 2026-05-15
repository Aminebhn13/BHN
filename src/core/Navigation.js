import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { qs, qsa } from '../utils/dom.js'

export class Navigation {
  constructor(smoothScroll) {
    this.nav = qs('#nav')
    this.links = qsa('[data-nav]')
    this.smoothScroll = smoothScroll
    this.init()
  }

  init() {
    // Scroll-based nav style
    ScrollTrigger.create({
      start: 80,
      onEnter: () => this.nav.classList.add('scrolled'),
      onLeaveBack: () => this.nav.classList.remove('scrolled')
    })

    // Smooth scroll on nav links
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = link.getAttribute('href')
        this.smoothScroll.scrollTo(target)
      })
    })

    // Active link on scroll
    const sections = qsa('section[id]')
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.setActive(section.id),
        onEnterBack: () => this.setActive(section.id)
      })
    })
  }

  setActive(id) {
    this.links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id)
    })
  }
}
