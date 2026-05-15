import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { Loader } from './core/Loader.js'
import { SmoothScroll } from './core/SmoothScroll.js'
import { Scene } from './three/Scene.js'
import { Cursor } from './core/Cursor.js'
import { Navigation } from './core/Navigation.js'
import { Hero } from './sections/Hero.js'
import { About } from './sections/About.js'
import { Services } from './sections/Services.js'
import { Process } from './sections/Process.js'
import { Manifesto } from './sections/Manifesto.js'
import { Contact } from './sections/Contact.js'
import './style.css'

gsap.registerPlugin(ScrollTrigger)

async function init() {
  // 1. Loader
  const loader = new Loader()
  await loader.start()

  // 2. Smooth Scroll
  const smoothScroll = new SmoothScroll()

  // 3. Three.js Scene
  const scene = new Scene()

  // 4. Cursor
  const cursor = new Cursor()

  // 5. Navigation
  const nav = new Navigation(smoothScroll)

  // 6. Sections
  const hero = new Hero()
  hero.reveal()

  new About()
  new Services()
  new Process()
  new Manifesto()
  new Contact()

  // 7. Camera scroll-driven animations
  setupCameraAnimation(scene)

  // 8. RAF loop
  let time = 0
  function raf(timestamp) {
    time = timestamp / 1000
    scene.update(time)
    cursor.update()
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

function setupCameraAnimation(scene) {
  // Hero -> default
  gsap.to(scene.camera.position, {
    scrollTrigger: {
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    },
    x: -4, y: 1, z: 5,
    ease: 'none',
    onUpdate: () => scene.setCameraTarget(-2, 0, 0)
  })

  gsap.to(scene.camera.position, {
    scrollTrigger: {
      trigger: '#services',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    },
    x: 4, y: 0, z: 4,
    ease: 'none',
    onUpdate: () => scene.setCameraTarget(2, 0, 0)
  })

  gsap.to(scene.camera.position, {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    },
    x: 0, y: -1, z: 6,
    ease: 'none',
    onUpdate: () => scene.setCameraTarget(0, 0, 0)
  })
}

init()
