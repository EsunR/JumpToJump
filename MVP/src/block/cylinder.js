// 长方体
import BaseBlock from './base';

export default class Cylinder extends BaseBlock {
  constructor(x, y, z) {
    super('cylinder')
    const size = this.width
    const geometry = new THREE.CylinderGeometry(size / 2, size / 2, this.height, 120)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff
    })
    this.instance = new THREE.Mesh(geometry, material)
    this.instance.name = 'cylinder'
    this.x = x
    this.y = y
    this.z = z
    this.instance.position.x = this.x
    this.instance.position.y = this.y
    this.instance.position.z = this.z
  }
}