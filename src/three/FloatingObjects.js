import * as THREE from 'three'

export class FloatingObjects {
  constructor(scene) {
    this.scene = scene
    this.objects = []
    this.init()
  }

  init() {
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff,
      wireframe: true,
      opacity: 0.15,
      transparent: true
    })

    // Octahedron - center
    const octGeo = new THREE.OctahedronGeometry(2.5, 0)
    const octMesh = new THREE.Mesh(octGeo, wireMat.clone())
    octMesh.position.set(0, 0, -2)
    this.scene.add(octMesh)
    this.objects.push({ mesh: octMesh, rotSpeed: { x: 0.003, y: 0.005 }, oscAmp: 0.3, oscFreq: 0.8 })

    // Torus - right
    const torGeo = new THREE.TorusGeometry(1.5, 0.4, 8, 24)
    const torMesh = new THREE.Mesh(torGeo, wireMat.clone())
    torMesh.position.set(6, 1, -4)
    this.scene.add(torMesh)
    this.objects.push({ mesh: torMesh, rotSpeed: { x: 0.004, y: 0.002 }, oscAmp: 0.5, oscFreq: 1.2 })

    // Icosahedron - left, semi-transparent solid
    const icoGeo = new THREE.IcosahedronGeometry(1.8, 0)
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x0066ff,
      opacity: 0.08,
      transparent: true,
      wireframe: false
    })
    const icoMesh = new THREE.Mesh(icoGeo, icoMat)
    icoMesh.position.set(-6, -0.5, -3)
    this.scene.add(icoMesh)
    this.objects.push({ mesh: icoMesh, rotSpeed: { x: 0.002, y: 0.007 }, oscAmp: 0.4, oscFreq: 0.6 })

    // Small accent cubes
    const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, opacity: 0.3, transparent: true })
    const positions = [
      [3, 3, -5], [-4, 2, -6], [5, -2, -3], [-3, -3, -7], [2, 4, -8]
    ]
    positions.forEach(([x, y, z]) => {
      const cube = new THREE.Mesh(cubeGeo, cubeMat.clone())
      cube.position.set(x, y, z)
      this.scene.add(cube)
      this.objects.push({ mesh: cube, rotSpeed: { x: 0.01, y: 0.01 }, oscAmp: 0.2, oscFreq: Math.random() * 2 + 0.5 })
    })
  }

  update(time) {
    this.objects.forEach((obj, i) => {
      obj.mesh.rotation.x += obj.rotSpeed.x
      obj.mesh.rotation.y += obj.rotSpeed.y
      obj.mesh.position.y += Math.sin(time * obj.oscFreq + i) * 0.001 * obj.oscAmp
    })
  }
}
