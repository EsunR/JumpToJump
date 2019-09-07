// 长方体
import BaseBlock from './base';
import blockConf from '../config/block-conf';

export default class Cuboid extends BaseBlock {
  constructor(x, y, z, width = blockConf.width, name = 'color') {
    super('cuboid')
    const size = this.size = width
    if (name === 'color') {
      const seed = Math.floor(Math.random() * 6)
      let currentColor
      switch (seed) {
        case 0:
          currentColor = blockConf.colors.orange
          break
        case 1:
          currentColor = blockConf.colors.orangeDark
          break
        case 2:
          currentColor = blockConf.colors.green
          break
        case 3:
          currentColor = blockConf.colors.blue
          break
        case 4:
          currentColor = blockConf.colors.yellow
          break
        case 5:
          currentColor = blockConf.colors.purple
          break
      }
      const innerMaterial = new THREE.MeshLambertMaterial({ color: blockConf.colors.white })
      const outerMaterial = new THREE.MeshLambertMaterial({ color: currentColor })
      const innerHeight = 3
      const outerHeight = (blockConf.height - innerHeight) / 2
      const outerGemetry = new THREE.BoxGeometry(size, outerHeight, size)
      const innerGemetry = new THREE.BoxGeometry(size, innerHeight, size)

      const totalMesh = new THREE.Object3D()

      const topMesh = new THREE.Mesh(outerGemetry, outerMaterial)
      topMesh.position.y = (innerHeight + outerHeight) / 2
      topMesh.castShadow = true

      const middleMesh = new THREE.Mesh(innerGemetry, innerMaterial)
      middleMesh.castShadow = true

      const bottomMesh = new THREE.Mesh(outerGemetry, outerMaterial)
      bottomMesh.position.y = -(innerHeight + outerHeight) / 2
      bottomMesh.castShadow = true

      totalMesh.add(topMesh)
      totalMesh.add(middleMesh)
      totalMesh.add(bottomMesh)

      this.instance = totalMesh
    } else {
      const geometry = new THREE.BoxGeometry(size, this.height, size)
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff
      })
      this.instance = new THREE.Mesh(geometry, material)
    }
    this.instance.name = 'block'
    // 让物体可以被投射阴影同时可以投射阴影
    this.instance.receiveShadow = true
    this.instance.castShadow = true
    this.x = x
    this.y = y
    this.z = z
    this.instance.position.x = this.x
    this.instance.position.y = this.y
    this.instance.position.z = this.z
  }
}