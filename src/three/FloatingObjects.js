import * as THREE from 'three'
import gsap from 'gsap'

function spherePositions(count, radius = 2) {
  const positions = []
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi
    positions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    )
  }
  return new Float32Array(positions)
}

function octahedronPositions(count, radius = 2) {
  const geo = new THREE.OctahedronGeometry(radius, 2)
  const original = geo.attributes.position.array
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const src = (i % (original.length / 3)) * 3
    positions[i * 3] = original[src]
    positions[i * 3 + 1] = original[src + 1]
    positions[i * 3 + 2] = original[src + 2]
  }
  geo.dispose()
  return positions
}

function torusPositions(count, R = 2, r = 0.6) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = (i / count) * Math.PI * 2
    const v = Math.random() * Math.PI * 2
    positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u)
    positions[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u)
    positions[i * 3 + 2] = r * Math.sin(v)
  }
  return positions
}

function icosahedronPositions(count, radius = 2) {
  const geo = new THREE.IcosahedronGeometry(radius, 1)
  const original = geo.attributes.position.array
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const src = (i % (original.length / 3)) * 3
    positions[i * 3] = original[src]
    positions[i * 3 + 1] = original[src + 1]
    positions[i * 3 + 2] = original[src + 2]
  }
  geo.dispose()
  return positions
}

class MorphObject {
  constructor(scene, position, color, shapes, phaseOffset = 0) {
    this.scene = scene
    this.shapes = shapes
    this.currentIdx = 0
    this.count = 120

    // Pre-compute all shape positions
    this.shapePositions = shapes.map(fn => fn(this.count))

    const positions = this.shapePositions[0].slice()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    this.material = new THREE.PointsMaterial({
      color,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })

    this.points = new THREE.Points(this.geometry, this.material)
    this.points.position.copy(position)
    scene.add(this.points)

    this.currentPositions = positions.slice()
    this.targetPositions = positions.slice()

    setTimeout(() => this.startMorphLoop(), phaseOffset)
  }

  startMorphLoop() {
    this.morphTo((this.currentIdx + 1) % this.shapes.length)
  }

  morphTo(idx) {
    this.currentIdx = idx
    const target = this.shapePositions[idx]
    const current = this.currentPositions.slice()
    const progress = { t: 0 }

    gsap.to(progress, {
      t: 1,
      duration: 4,
      ease: 'power2.inOut',
      onUpdate: () => {
        const pos = this.geometry.attributes.position.array
        for (let i = 0; i < this.count * 3; i++) {
          pos[i] = current[i] + (target[i] - current[i]) * progress.t
          this.currentPositions[i] = pos[i]
        }
        this.geometry.attributes.position.needsUpdate = true
      },
      onComplete: () => {
        setTimeout(() => this.morphTo((idx + 1) % this.shapes.length), 800)
      }
    })
  }

  update(time) {
    this.points.rotation.y += 0.003
    this.points.rotation.x += 0.001
    this.points.position.y += Math.sin(time * 0.4) * 0.002
  }
}

export class FloatingObjects {
  constructor(scene) {
    this.scene = scene
    this.objects = []
    this.init()
  }

  init() {
    // Object A — left — sphere↔octahedron↔icosahedron
    this.objects.push(new MorphObject(
      this.scene,
      new THREE.Vector3(-6, 0, -3),
      0x00f5ff,
      [spherePositions, octahedronPositions, icosahedronPositions],
      0
    ))

    // Object B — center — sphere↔torus↔octahedron
    this.objects.push(new MorphObject(
      this.scene,
      new THREE.Vector3(0, 0.5, -5),
      0x4499ff,
      [spherePositions, torusPositions, octahedronPositions],
      1300
    ))

    // Object C — right — icosahedron↔sphere↔torus
    this.objects.push(new MorphObject(
      this.scene,
      new THREE.Vector3(6, -0.5, -4),
      0xaa44ff,
      [icosahedronPositions, spherePositions, torusPositions],
      2600
    ))
  }

  update(time) {
    this.objects.forEach(obj => obj.update(time))
  }
}
