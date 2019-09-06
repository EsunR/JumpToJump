import blockConf from '../config/block-conf';
import { customAnimation } from '../../libs/animation';

export default class BaseBlock {
  constructor(type) {
    this.type = type // cuboid | cylinder
    this.height = blockConf.height
    this.width = blockConf.width
    this.status = 'stop'
    this.scale = 1
  }

  update() {
    if (this.status == 'shrink') {
      this._shrink()
    }
  }

  _shrink() {
    const DELTA_SCALE = 0.005
    const MIN_SCALE = 0.55
    this.scale -= DELTA_SCALE
    this.scale = Math.max(MIN_SCALE, this.scale)
    if (this.scale <= MIN_SCALE) {
      this.status = 'stop'
      return
    }
    this.instance.scale.y = this.scale
    const deltaY = this.height * DELTA_SCALE / 2
    this.instance.position.y -= deltaY
  }

  rebound() {
    this.status = 'stop'
    this.scale = 1
    customAnimation.to(0.5, this.instance.scale, { y: 1 }, 'Elastic.easeOut')
    customAnimation.to(0.5, this.instance.position, { y: 0 }, 'Elastic.easeOut')
  }

  shrink() {
    this.status = 'shrink'
  }

  showup() {
    this.status = 'showup'
    this.instance.position.y = 60
    customAnimation.to(0.3, this.instance.position, {
      y: 0
    }, 'Bounce.easeOut')
  }

  getVertices() {
    const vertices = []
    const centerPosition = {
      x: this.instance.position.x,
      z: this.instance.position.z
    }
    /*
     获取 block 上平面四条边的顶点坐标，存放入 vertices
     |-[3]-----[1]--→ x
     |    |   |
     | [2]-----[0]
     ↓
     z
    */
    // this.size 是来自继承该抽象类的普通类中的属性 
    console.log("size:",this.size);
    vertices.push([centerPosition.x + this.size / 2, centerPosition.z + this.size / 2])
    vertices.push([centerPosition.x + this.size / 2, centerPosition.z - this.size / 2])
    vertices.push([centerPosition.x - this.size / 2, centerPosition.z + this.size / 2])
    vertices.push([centerPosition.x - this.size / 2, centerPosition.z - this.size / 2])
    return vertices
  }
}