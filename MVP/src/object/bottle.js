import bottleConf from '../config/bottle-conf';
import blockConf from '../config/block-conf';
import gameConf from '../config/game-conf';
import { customAnimation, TweenAnimation } from '../../libs/animation';
import aduioManager from '../modules/audio-manager';
import ScoreText from '../view3d/scoreText';

class Bottle {
  constructor() {
    this.instance = null
    this.status = 'stop'
    this.scale = 1

    this.direction = 1
    this.axis = null // 跳跃向量：瓶子起跳点到下一个方块中心的连线
    this.velocity = {
      vx: 0, // 水平方向速度
      vy: 0 //竖直方向速度
    }
    this.flyingTime = 0
  }

  init() {
    this.loader = new THREE.TextureLoader() // 加载纹理
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
      this.objStartPosition.y + 80,
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

    // 添加粒子
    this.particles = []
    const particleGeometry = new THREE.PlaneGeometry(2, 2)
    const whiteParticleMaterial = new THREE.MeshBasicMaterial({
      map: this.loader.load('/game/res/images/white.png'),
      alphaTest: 0.5
    })
    const greenParticleMaterial = new THREE.MeshBasicMaterial({
      map: this.loader.load('/game/res/images/green.png'),
      alphaTest: 0.5
    })
    // 创建15个白色粒子，5个绿色粒子
    for (let i = 0; i < 15; i++) {
      const particle = new THREE.Mesh(particleGeometry, whiteParticleMaterial)
      particle.position.x = -Math.PI / 4
      particle.position.y = -Math.PI / 5
      particle.position.z = -Math.PI / 5
      particle.rotateY(-Math.PI / 4)
      particle.rotateX(-Math.PI / 4)
      this.particles.push(particle)
      this.obj.add(particle)
    }
    for (let i = 0; i < 5; i++) {
      const particle = new THREE.Mesh(particleGeometry, greenParticleMaterial)
      particle.position.x = -Math.PI / 4
      particle.position.y = -Math.PI / 5
      particle.position.z = -Math.PI / 5
      particle.rotateY(-Math.PI / 4)
      particle.rotateX(-Math.PI / 4)
      this.particles.push(particle)
      this.obj.add(particle)
    }

    // 添加分数指示标
    this.scoreText = new ScoreText()
    this.scoreText.init({
      fillStyle: 0x252525
    })
    this.scoreText.instance.visible = false
    this.scoreText.instance.rotation.y = -Math.PI / 4
    this.scoreText.instance.scale.set(0.5, 0.5, 0.5)
    this.obj.add(this.scoreText.instance)
  }

  showAddScore(score) {
    const value = '+' + score
    this.scoreText.updateScore(value)
    this.scoreText.instance.visible = true
    this.scoreText.instance.position.y = 3
    this.scoreText.instance.material.opacity = 1
    customAnimation.to(0.5, this.scoreText.instance.position, { y: blockConf.height + 6 })
    customAnimation.to(0.5, this.scoreText.instance.material, { opacity: 0 })
  }

  reset() {
    this.stop()
    this.instance = null
    this.init()
  }

  loadTexture() {
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
    if (this.status === 'shrink') {
      this._shrink()
    } else if (this.status === 'jump') {
      const tickTime = Date.now() - this.lastFrameTime
      this._jump(tickTime)
    }
    this.head.rotation.y += 0.06
    this.lastFrameTime = Date.now()
  }

  setDirection(direction, axis) {
    console.log("设置跳跃方向：", direction);
    console.log("设置跳跃目标点：", axis);
    this.direction = direction
    this.axis = axis
  }

  rotate() {
    const scale = 1.4
    this.human.rotation.z = this.human.rotation.x = 0
    // direction 0 沿x轴跳跃
    if (this.direction == 0) { // x
      customAnimation.to(0.07, this.human.rotation, { z: this.human.rotation.z - Math.PI })
      customAnimation.to(0.1, this.human.rotation, { z: this.human.rotation.z - 2 * Math.PI }, 'Linear', 0.14)
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y + 0.9 * scale, x: this.head.position.x + 0.45 * scale })
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y - 0.9 * scale, x: this.head.position.x - 0.45 * scale }, null, 0.1)
      customAnimation.to(0.15, this.head.position, { y: 7.56, x: 0 }, null, 0.25)
      customAnimation.to(0.05, this.body.scale, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
      customAnimation.to(0.05, this.body.scale, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2) }, null, 0.1)
      customAnimation.to(0.2, this.body.scale, { y: 1, x: 1, z: 1 }, null, 0.2)
    } else if (this.direction == 1) { // z
      // direction 0 沿z轴跳跃
      customAnimation.to(0.07, this.human.rotation, { x: this.human.rotation.x - Math.PI })
      customAnimation.to(0.1, this.human.rotation, { x: this.human.rotation.x - 2 * Math.PI }, null, 0.14)
      customAnimation.to(0.1, this.head.position, { y: this.head.position.y + 0.9 * scale, z: this.head.position.z - 0.45 * scale })
      customAnimation.to(0.1, this.head.position, { z: this.head.position.z + 0.45 * scale, y: this.head.position.y - 0.9 * scale }, null, 0.1)
      customAnimation.to(0.15, this.head.position, { y: 7.56, z: 0 }, null, 0.25)
      customAnimation.to(0.05, this.body.scale, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), null, 0.7) })
      customAnimation.to(0.05, this.body.scale, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2) }, null, 0.1)
      customAnimation.to(0.2, this.body.scale, { y: 1, x: 1, z: 1 }, null, 0.2)
    }
  }

  stop() {
    this.status = 'stop'
  }

  shrink() {
    this.status = 'shrink'
    this.gatherParticles()
  }

  _shrink() {
    // 竖直方向的压缩分量
    const DELTA_SCALE = 0.005
    // 竖直方向可被压缩的最小高度
    const MIN_SCALE = 0.55
    // 压缩时主体横向的增大系数
    const HORIZON_DELTA_SCALE = 0.007
    // 头部下压的高度系数
    const HEAD_DELTA = 0.03
    this.scale -= DELTA_SCALE // this.scale ↓
    this.scale = Math.max(MIN_SCALE, this.scale)
    if (this.scale <= MIN_SCALE) {
      return
    }
    this.body.scale.y = this.scale
    this.body.scale.x += HORIZON_DELTA_SCALE
    this.body.scale.z += HORIZON_DELTA_SCALE
    this.head.position.y -= HEAD_DELTA

    const bottleDeltaY = HEAD_DELTA / 2
    const deltaY = blockConf.height * DELTA_SCALE / 2
    this.obj.position.y -= (bottleDeltaY + deltaY * 2)
  }

  showup() {
    customAnimation.to(0.5, this.obj.position, {
      x: bottleConf.initPosition.x,
      y: this.objStartPosition.y,
      z: bottleConf.initPosition.z
    }, 'Bounce.easeOut')
    setTimeout(() => {
      aduioManager.start.play()
    }, 500);
  }

  jump() {
    this.flyingTime = 0
    this.status = 'jump'
    this.resetGatherParticles()
  }

  _jump(tickTime) {
    // 计算每一时刻的状态
    const t = tickTime / 1000
    const translateH = this.velocity.vx * t
    const translateY = this.velocity.vy * t - 0.5 * gameConf.gravity * t * t - gameConf.gravity * this.flyingTime * t
    this.obj.translateY(translateY)
    this.obj.translateOnAxis(this.axis, translateH)
    this.flyingTime = this.flyingTime + t
  }

  // 瓶身后倾动画
  hypsokinesis() {
    this.status = 'hypsokinesis'
    setTimeout(() => {
      if (this.direction == 0) { // 沿x轴跳跃
        customAnimation.to(0.8, this.obj.rotation, { z: Math.PI / 2 })
      } else {
        customAnimation.to(0.8, this.obj.rotation, { x: Math.PI / 2 })
      }
      setTimeout(() => {
        customAnimation.to(0.4, this.obj.position, { y: 1.2 - blockConf.height / 2 })
        customAnimation.to(0.2, this.head.position, { x: 1.125 })
        customAnimation.to(0.2, this.head.position, { x: 0 }, 'Linear', 0.2)
      }, 350);
    }, 150)
  }

  // 瓶身前倾动画
  forerake() {
    this.status = 'forerake'
    setTimeout(() => {
      if (this.direction == 0) { // 沿x轴跳跃
        customAnimation.to(0.8, this.obj.rotation, { z: -Math.PI / 2 })
      } else {
        customAnimation.to(0.8, this.obj.rotation, { x: -Math.PI / 2 })
      }
      setTimeout(() => {
        customAnimation.to(0.4, this.obj.position, { y: 1.2 - blockConf.height / 2 })
      }, 350);
    }, 150)
  }

  // 粒子内聚动画
  gatherParticles() {
    // 生成粒子并调用粒子动画
    for (let i = 10; i < 20; i++) {
      this.particles[i].gathering = true // 内聚状态
      this.particles[i].scattering = false // 外散状态
      this._gatherParticles(this.particles[i])
    }
    this.gatherTime = setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        this.particles[i].gathering = true
        this.particles[i].scattering = false
        this._gatherParticles(this.particles[i])
      }
    }, 500 + 1000 * Math.random());
  }

  _gatherParticles(particle) {
    // 设置粒子出现的距离
    const minDistance = 1
    const maxDistance = 8
    // 初始化粒子
    particle.scale.set(1, 1, 1)
    particle.visible = false
    // 由 x,z 决定粒子出现的象限
    const x = Math.random() > 0.5 ? 1 : -1
    const z = Math.random() > 0.5 ? 1 : -1
    // 初始化粒子位置
    particle.position.x = (minDistance + (maxDistance - minDistance) * Math.random()) * x
    particle.position.y = minDistance + (maxDistance - minDistance) * Math.random()
    particle.position.z = (minDistance + (maxDistance - minDistance) * Math.random()) * z

    setTimeout(() => {
      if (!particle.gathering) return
      particle.visible = true
      const duration = 0.5 + Math.random() * 0.4
      customAnimation.to(duration, particle.scale, {
        x: 0.8 + Math.random(),
        y: 0.8 + Math.random(),
        z: 0.8 + Math.random()
      })
      customAnimation.to(duration, particle.position, {
        x: Math.random() * x,
        y: Math.random() * 2.5,
        z: Math.random() * z
      }, undefined, 0, () => {
        if (particle.gathering) {
          this._gatherParticles(particle)
        }
      })
    }, Math.random() * 500);
  }

  resetGatherParticles() {
    if (this.gatherTime) {
      clearTimeout(this.gatherTime)
    }
    this.gatherTime = null
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].gathering = false
      this.particles[i].scattering = false
      this.particles[i].visible = false
    }
  }

  scatterParticles() {
    for (let i = 0; i < 10; i++) {
      this.particles[i].scattering = true
      this.particles[i].gathering = false
      this._scatterParticle(this.particles[i])
    }
  }

  _scatterParticle(particle) {
    const minDistance = bottleConf.bodyWidth / 2
    const maxDistance = 2
    const x = (minDistance + Math.random() * (maxDistance - minDistance)) * (1 - 2 * Math.random())
    const z = (minDistance + Math.random() * (maxDistance - minDistance)) * (1 - 2 * Math.random())
    particle.scale.set(1, 1, 1)
    particle.visible = false
    particle.position.x = x
    particle.position.y = -0.5
    particle.position.z = z

    if (!particle.scattering) return
    particle.visible = true
    const duration = 0.1 + Math.random() * 0.2
    customAnimation.to(duration, particle.scale, {
      x: 0.2,
      y: 0.2,
      z: 0.2
    })
    customAnimation.to(duration, particle.position, {
      x: 2 * x,
      y: Math.random() * 2.5 + 2,
      z: 2 * z
    }, undefined, 0, () => {
      particle.scattering = false
      particle.visible = false
    })
  }

}

export default new Bottle()