import * as THREE from 'three'

export class Grid {
  constructor(scene) {
    this.scene = scene
    this.init()
  }

  init() {
    const size = 60
    const divisions = 30
    const color = new THREE.Color(0x00f5ff)

    const helper = new THREE.GridHelper(size, divisions, color, color)
    helper.material.opacity = 0.06
    helper.material.transparent = true
    helper.position.y = -4

    this.mesh = helper
    this.scene.add(helper)

    // Horizontal plane lines (isometric feel)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f5ff,
      opacity: 0.04,
      transparent: true
    })

    const group = new THREE.Group()
    for (let i = -15; i <= 15; i += 2) {
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-30, -4, i),
        new THREE.Vector3(30, -4, i)
      ])
      group.add(new THREE.Line(geo, lineMaterial))
    }
    this.scene.add(group)
  }

  update(time) {
    if (this.mesh) {
      this.mesh.position.z = (time * 0.3) % 2
    }
  }
}
