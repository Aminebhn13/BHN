import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class SmoothScroll {
  constructor() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    })

    this.lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }

  raf(time) {
    this.lenis.raf(time)
  }

  scrollTo(target) {
    this.lenis.scrollTo(target, { duration: 1.4 })
  }

  get scrollY() {
    return this.lenis.scroll
  }
}
