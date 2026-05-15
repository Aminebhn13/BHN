import * as THREE from 'three'
import { Particles } from './Particles.js'
import { Grid } from './Grid.js'
import { FloatingObjects } from './FloatingObjects.js'
import { lerp } from '../utils/math.js'

export class Scene {
  constructor() {
    this.canvas = document.getElementById('webgl')
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.cameraTarget = new THREE.Vector3(0, 0, 0)
    this.cameraTargetLerped = new THREE.Vector3(0, 0, 0)
    this.mouse = { x: 0, y: 0 }
    this.init()
    this.initLights()
    this.initModules()
    this.initResize()
    this.initMouseParallax()
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    this.camera.position.set(0, 2, 8)
    this.scene.add(this.camera)
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0x0066ff, 0.3)
    this.scene.add(ambient)

    this.pointLight = new THREE.PointLight(0x00f5ff, 2, 20)
    this.pointLight.position.set(5, 5, 5)
    this.scene.add(this.pointLight)

    const pointLight2 = new THREE.PointLight(0x8800ff, 1, 15)
    pointLight2.position.set(-5, -2, 3)
    this.scene.add(pointLight2)
  }

  initModules() {
    this.grid = new Grid(this.scene)
    this.particles = new Particles(this.scene)
    this.floatingObjects = new FloatingObjects(this.scene)
  }

  initResize() {
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.width, this.height)
    })
  }

  initMouseParallax() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / this.width - 0.5) * 2
      this.mouse.y = -(e.clientY / this.height - 0.5) * 2
    })
  }

  setCameraPosition(x, y, z) {
    this.camera.position.set(x, y, z)
  }

  setCameraTarget(x, y, z) {
    this.cameraTarget.set(x, y, z)
  }

  update(time) {
    // Rotate point light
    this.pointLight.position.x = Math.sin(time * 0.5) * 8
    this.pointLight.position.z = Math.cos(time * 0.5) * 8

    // Mouse parallax on camera
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x * 0.1) * 0.02
    this.camera.position.y += (this.mouse.y * 0.3 - this.camera.position.y * 0.05) * 0.02

    // Smooth lookAt
    this.cameraTargetLerped.x = lerp(this.cameraTargetLerped.x, this.cameraTarget.x, 0.05)
    this.cameraTargetLerped.y = lerp(this.cameraTargetLerped.y, this.cameraTarget.y, 0.05)
    this.cameraTargetLerped.z = lerp(this.cameraTargetLerped.z, this.cameraTarget.z, 0.05)
    this.camera.lookAt(this.cameraTargetLerped)

    // Update modules
    this.particles.update(time)
    this.grid.update(time)
    this.floatingObjects.update(time)

    this.renderer.render(this.scene, this.camera)
  }
}
