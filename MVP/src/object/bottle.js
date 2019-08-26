import bottleConf from '../config/bootle-conf';

class Bottle {
  constructor() {
    this.instance = null
  }

  init() {
    // bottle分为多个部分，Object3D可以将各部分作为一个整体操作
    this.obj = new THREE.Object3D
    // 设置obj基本信息
    this.obj.name = 'bottle'
    let { x, y, z } = bottleConf.initPosition
    this.obj.position.set(x, y + 10, z)

    // 设置一个基础纹理供复用
    var basicMaterial = new THREE.MeshPhongMaterial({
      color: 0x800080
    })

    this.bottle = new THREE.Object3D()

    // 设置head的信息
    var headRadius = 2.1168 // head半径
    this.head = new THREE.Mesh(
      new THREE.OctahedronBufferGeometry(headRadius),
      basicMaterial
    )
    // 组合体内的元素的坐标是相对于整个组合体的
    this.head.position.y = 7.5
    this.head.position.x = 0
    this.head.position.z = 0
    this.head.castShadow = true

    // 用body呈放middle与bottom
    this.body = new THREE.Object3D()

    // 设置middle的信息
    this.middle = new THREE.Mesh(
      new THREE.CylinderGeometry(
        headRadius / 1.4, headRadius / 1.44 * 0.88, headRadius * 1.2, 20
      ),
      basicMaterial
    )
    this.middle.castShadow = true
    this.middle.position.y = 1.3857 * headRadius

    // 设置bottom的信息
    this.bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20
      ),
      basicMaterial
    )
    this.bottom.castShadow = true


    // 组合
    /* 
      obj - bottle - body - bottom
              |       |--- middle
              |
              | ---- head
    */
    this.body.add(this.bottom)
    this.body.add(this.middle)
    this.bottle.add(this.body)
    this.bottle.add(this.head)
    this.obj.add(this.bottle)


    this.instance = this.obj
  }
}

export default new Bottle()