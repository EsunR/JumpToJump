// 长方体
import BaseBlock from './base';
import blockConf from '../config/block-conf';
import utils from '../utils/index';

export default class Cuboid extends BaseBlock {
  constructor(x, y, z, width = blockConf.width, name = 'well') {
    super('cuboid')
    this.loader = new THREE.TextureLoader()
    const size = width
    if (name === 'color') {

    } else if (name == 'well') {
      const geometry = new THREE.BoxGeometry(size, this.height, size)
      const material = new THREE.MeshLambertMaterial({
        map: this.loader.load('res/images/well.png')
      })
      utils.mapUv(280, 428, geometry, 1, 0, 0, 280, 148) // front
      utils.mapUv(280, 428, geometry, 2, 0, 148, 280, 428) // top
      utils.mapUv(280, 428, geometry, 1, 0, 0, 280, 148, true) // right
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