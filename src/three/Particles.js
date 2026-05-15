import * as THREE from 'three'
import { randFloat } from '../utils/math.js'
import vertexShader from './shaders/particles.vert'
import fragmentShader from './shaders/particles.frag'

export class Particles {
  constructor(scene) {
    this.scene = scene
    this.count = 500
    this.init()
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

  update(time) {
    this.material.uniforms.uTime.value = time
  }

  dispose() {
    this.points.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.points)
  }
}
