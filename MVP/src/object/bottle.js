import bottleConf from '../config/bottle-conf';
import blockConf from '../config/block-conf';
import { customAnimation } from '../../libs/animation';

class Bottle {
  constructor() {
    this.instance = null
    this.direction = 0
    this.axis = null // 跳跃轴：瓶子起跳点到下一个方块中心的连线
  }

  init() {
    const headRadius = bottleConf.headRadius

    // bottle分为多个部分，Object3D可以将各部分作为一个整体操作
    this.obj = new THREE.Object3D
    // 设置obj基本信息
    this.obj.name = 'bottle'
    let { x, y, z } = bottleConf.initPosition
    y = y + (1.91423 * headRadius) / 2 + blockConf.height / 2
    this.objStartPosition = { x, y, z }
    this.obj.position.set(
      this.objStartPosition.x,
      this.objStartPosition.y + 60,
      this.objStartPosition.z
    )

    // 用来做动画的对象
    this.human = new THREE.Object3D


    // 加载纹理
    const { specularMaterial, middleMaterial, bottomMaterial } = this.loadTexture()


    // 用bottle呈放head与body
    this.bottle = new THREE.Object3D()


    // 设置head的信息
    this.head = new THREE.Mesh(
      new THREE.OctahedronBufferGeometry(headRadius),
      specularMaterial
    )
    // 组合体内的元素的坐标是相对于整个组合体的
    this.head.position.y = 7.5
    this.head.position.x = 0
    this.head.position.z = 0
    this.head.castShadow = true


    // 用body呈放middle与bottom
    this.body = new THREE.Object3D()


    // 设置top信息
    let topGeometry = new THREE.SphereGeometry(headRadius / 1.4, 20, 20)
    topGeometry.scale(1, 0.54, 1)
    this.top = new THREE.Mesh(
      topGeometry,
      specularMaterial
    )
    this.top.castShadow = true
    this.top.position.y = 1.8143 * headRadius
    this.top.position.x = 0
    this.top.position.z = 0


    // 设置middle的信息
    this.middle = new THREE.Mesh(
      new THREE.CylinderGeometry(
        headRadius / 1.4, headRadius / 1.44 * 0.88, headRadius * 1.2, 20
      ),
      middleMaterial
    )
    this.middle.castShadow = true
    this.middle.position.y = 1.3857 * headRadius


    // 设置bottom的信息
    this.bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.62857 * headRadius, 0.907143 * headRadius, 1.91423 * headRadius, 20
      ),
      bottomMaterial
    )
    this.bottom.castShadow = true


    // 组合
    /* 
    obj - human - bottle - body - bottom
                    |       | --- middle
                    |       | --- top
                    |
                    | ---- head
    */
    this.body.add(this.bottom)
    this.body.add(this.middle)
    this.body.add(this.top)
    this.human.add(this.body)
    this.human.add(this.head)
    this.bottle.add(this.human)
    this.obj.add(this.bottle)


    this.instance = this.obj
  }

  loadTexture() {
    // 加载纹理
    this.loader = new THREE.TextureLoader()
    // 加载高光材质
    this.specularTexture = this.loader.load('/game/res/images/head.png') // 资源加载的相对路径是以 /game 开始
    this.specularTexture.minFilter = THREE.NearestFilter
    var specularMaterial = new THREE.MeshBasicMaterial({
      map: this.specularTexture
    })
    // 加载中部纹理
    this.middleTexture = this.loader.load('/game/res/images/middle.png')
    this.middleTexture.minFilter = THREE.NearestFilter
    var middleMaterial = new THREE.MeshBasicMaterial({
      map: this.middleTexture
    })
    // 加载底部纹理
    this.bottomTexture = this.loader.load('/game/res/images/bottom.png')
    this.bottomTexture.minFilter = THREE.NearestFilter
    var bottomMaterial = new THREE.MeshBasicMaterial({
      map: this.bottomTexture
    })
    return { specularMaterial, middleMaterial, bottomMaterial }
  }

  update() {
    this.head.rotation.y += 0.06
  }

  showup() {
    // this.objStartPosition
    customAnimation.to(0.8, this.obj.position, { y: this.objStartPosition.y }, 'Bounce.easeOut')
  }

  setDirection(direction, axis) {
    this.direction = direction
    this.axis = axis

  }

  rotate() {
    const scale = 1.4
    this.human.rotation.z = this.human.rotation.x = 0
    // direction 0 沿x轴跳跃
    if (this.direction == 0) { // x
      customAnimation.to(0.14, this.human.rotation, { z: this.human.rotation.z - Math.PI })
      customAnimation.to(0.18, this.human.rotation, { z: this.human.rotation.z - 2 * Math.PI }, 0.14)
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y + 0.9 * scale, x: this.head.position.x + 0.45 * scale })
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y - 0.9 * scale, x: this.head.position.x - 0.45 * scale }, 0.1)
      customAnimation.to(0.15, this.head.position, { y: 7.56, x: 0 }, 0.25)
      customAnimation.to(0.1, this.body.scale, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
      customAnimation.to(0.1, this.body.scale, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2) }, 0.1)
      customAnimation.to(0.3, this.body.scale, { y: 1, x: 1, z: 1 }, 0.2)
    } else if (this.direction == 1) { // z
      // direction 0 沿z轴跳跃
      customAnimation.to(0.14, this.human.rotation, { x: this.human.rotation.x - Math.PI })
      customAnimation.to(0.18, this.human.rotation, { x: this.human.rotation.x - 2 * Math.PI }, 0.14)
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y + 0.9 * scale, z: this.head.position.z - 0.45 * scale })
      customAnimation.to(0.1, this.head.position, { z: this.head.position.z + 0.45 * scale, y: this.head.position.y - 0.9 * scale }, 0.1)
      customAnimation.to(0.15, this.head.position, { y: 7.56, z: 0 }, 0.25)
      customAnimation.to(0.05, this.body.scale, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
      customAnimation.to(0.05, this.body.scale, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2) }, 0.1)
      customAnimation.to(0.2, this.body.scale, { y: 1, x: 1, z: 1 }, 0.2)
    }
  }
}

export default new Bottle()