// 长方体
import BaseBlock from './base';

export default class Cylinder extends BaseBlock {
  constructor(x, y, z) {
    super('cylinder')
    const size = this.width
    const geometry = new THREE.CylinderGeometry(size / 2, size / 2, this.height, 120)
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff
    })
    this.instance = new THREE.Mesh(geometry, material)
    this.instance.name = 'block'
    this.x = x
    this.y = y
    this.z = z
    this.instance.position.x = this.x
    this.instance.position.y = this.y
    this.instance.position.z = this.z
    // 让物体可以被投射阴影同时又能接收阴影
    this.instance.receiveShadow = true
    this.instance.castShadow = true
  }
}