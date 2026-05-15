import * as THREE from 'three'
import { randFloat } from '../utils/math.js'
import vertexShader from './shaders/particles.vert'
import fragmentShader from './shaders/particles.frag'

export class Particles {
  constructor(scene) {
    this.scene = scene
    this.count = 300
    this.mouse3D = new THREE.Vector3(0, 0, 0)
    this.mouseInfluence = 3.0
    this.mouseActive = false
    this.mouseIdleTimer = null
    this.originalPositions = null
    this.currentPositions = null
    this.velocities = null
    this.connectionLines = null
    this.connectionGeo = null
    this.scrollVelocity = 0
    this.lastScrollY = 0
    this.init()
    this.initConnections()
    this.initScrollListener()
  }

  init() {
    const positions = new Float32Array(this.count * 3)
    const scales = new Float32Array(this.count)

    for (let i = 0; i < this.count; i++) {
      positions[i * 3]     = randFloat(-20, 20)
      positions[i * 3 + 1] = randFloat(-10, 10)
      positions[i * 3 + 2] = randFloat(-20, 20)
      scales[i] = randFloat(0.5, 2.0)
    }

    this.originalPositions = positions.slice()
    this.currentPositions = positions.slice()
    this.velocities = new Float32Array(this.count * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 150 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    this.points = new THREE.Points(geometry, this.material)
    this.scene.add(this.points)
  }

  initConnections() {
    const maxLines = 800
    const positions = new Float32Array(maxLines * 6)
    this.connectionGeo = new THREE.BufferGeometry()
    this.connectionGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const lineMat = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.connectionLines = new THREE.LineSegments(this.connectionGeo, lineMat)
    this.scene.add(this.connectionLines)
  }

  initScrollListener() {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY
      this.scrollVelocity = currentScrollY - this.lastScrollY
      this.lastScrollY = currentScrollY
    }, { passive: true })
  }

  setMouse3D(x, y, z) {
    this.mouse3D.set(x, y, z)
    this.mouseActive = true
    clearTimeout(this.mouseIdleTimer)
    this.mouseIdleTimer = setTimeout(() => {
      this.mouseActive = false
    }, 3000)
  }

  update(time) {
    this.material.uniforms.uTime.value = time

    const pos = this.points.geometry.attributes.position.array
    const orig = this.originalPositions
    const vel = this.velocities
    const threshold = this.mouseInfluence

    for (let i = 0; i < this.count; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      if (this.mouseActive) {
        const dx = pos[ix] - this.mouse3D.x
        const dy = pos[iy] - this.mouse3D.y
        const dz = pos[iz] - this.mouse3D.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < threshold) {
          const force = (threshold - dist) / threshold * 0.05
          vel[ix] += dx * force
          vel[iy] += dy * force
          vel[iz] += dz * force
        }
      }

      // Scroll elongation
      if (Math.abs(this.scrollVelocity) > 2) {
        vel[iy] += this.scrollVelocity * 0.001
      }

      // Spring back to original
      vel[ix] += (orig[ix] - pos[ix]) * 0.02
      vel[iy] += (orig[iy] - pos[iy]) * 0.02
      vel[iz] += (orig[iz] - pos[iz]) * 0.02

      // Dampen
      vel[ix] *= 0.9
      vel[iy] *= 0.9
      vel[iz] *= 0.9

      pos[ix] += vel[ix]
      pos[iy] += vel[iy] + Math.sin(time * 0.5 + orig[ix] * 0.5) * 0.002
      pos[iz] += vel[iz]
    }

    this.points.geometry.attributes.position.needsUpdate = true

    // Update connections
    this.updateConnections(pos)

    this.scrollVelocity *= 0.8
  }

  updateConnections(pos) {
    const maxLines = 800
    const connPos = this.connectionGeo.attributes.position.array
    const threshold = 4.5
    let lineCount = 0

    for (let i = 0; i < this.count && lineCount < maxLines; i++) {
      for (let j = i + 1; j < this.count && lineCount < maxLines; j++) {
        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < threshold) {
          const li = lineCount * 6
          connPos[li]     = pos[i * 3]
          connPos[li + 1] = pos[i * 3 + 1]
          connPos[li + 2] = pos[i * 3 + 2]
          connPos[li + 3] = pos[j * 3]
          connPos[li + 4] = pos[j * 3 + 1]
          connPos[li + 5] = pos[j * 3 + 2]
          lineCount++
        }
      }
    }

    // Zero out unused
    for (let i = lineCount * 6; i < maxLines * 6; i++) {
      connPos[i] = 0
    }

    this.connectionGeo.attributes.position.needsUpdate = true
    this.connectionGeo.setDrawRange(0, lineCount * 2)
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.points)
    if (this.connectionLines) {
      this.connectionGeo.dispose()
      this.connectionLines.material.dispose()
      this.scene.remove(this.connectionLines)
    }
  }
}
