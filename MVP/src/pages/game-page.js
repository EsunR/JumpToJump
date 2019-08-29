import { scene } from '../scene/index';
import Cuboid from '../block/cuboid';
import Cylinder from '../block/cylinder';
import bottle from '../object/bottle';
import ground from '../object/ground'
import blockConf from '../config/block-conf';
import gameConf from '../config/game-conf';

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
    this.cameraMode = false
    this.targetPosition = {}
  }

  init() {
    // 对引入的实例进行挂载与初始化
    this.scene = scene
    this.scene.init()

    // 引入、初始化、添加地面到场景中
    this.ground = ground
    this.ground.init()
    this.addGround()

    // 挂载、添加 bottle 到场景中
    this.bottle = bottle
    this.bottle.init()
    this.addBottle()

    // 初始化并添加blck到场景中
    this.addInitBlock()

    // 绑定点击事件
    this.bindTouchEvent()

    // 进行场景的渲染
    this.render()
  }

  render() {
    this.scene.render()
    if (this.currentBlock) {
      this.currentBlock.update()
    }
    if (this.bottle) {
      this.bottle.update()
    }
    requestAnimationFrame(this.render.bind(this))
  }

  addInitBlock() {
    const cuboidBlock = new Cuboid(-15, 0, 0)
    this.currentBlock = cuboidBlock
    const cylinderBlock = new Cylinder(23, 0, 0)
    this.nextBlock = cylinderBlock
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)

    // 获取第二个物体的中心坐标为目标位置
    const initPosition = 0
    this.targetPosition = {
      x: 23,
      y: 0,
      z: 0
    }
    this.setDirection(initPosition)
  }

  addGround() {
    this.scene.instance.add(this.ground.instance)
  }

  addBottle() {
    this.scene.instance.add(this.bottle.instance)
    this.bottle.showup()
  }

  bindTouchEvent() {
    canvas.addEventListener('touchstart', this.touchStartCallback.bind(this))
    canvas.addEventListener('touchend', this.touchEndCallback.bind(this))
    canvas.addEventListener('touchmove', this.touchMoveCallback.bind(this))
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchstart', this.touchStartCallback)
    canvas.removeEventListener('touchend', this.touchEndCallback)
  }

  touchMoveCallback(e) {
    if (this.cameraMode) {
      let directionX = e.touches[0].pageX - this.lastX
      let directionY = e.touches[0].pageY - this.lastY
      this.lastX = e.touches[0].pageX
      this.lastY = e.touches[0].pageY
      // 向下滑动directionY + 向右滑动 directionX +
      let camera = this.scene.camera.instance
      let { x, y, z } = camera.position
      camera.position.set(x - directionX / 7, y + directionY / 7, z);
      camera.lookAt(new THREE.Vector3(0, 0, 0))
    }
  }

  touchStartCallback(e) {
    if (this.cameraMode) {
      this.lastX = e.touches[0].pageX
      this.lastY = e.touches[0].pageY
      return
    }
    this.touchStartTime = Date.now()
    this.bottle.shrink()
    this.currentBlock.shrink()
  }

  touchEndCallback() {
    if (this.cameraMode) {
      return
    }

    // 开始旋转
    this.bottle.rotate()

    // 计算弹射
    this.touchEndTime = Date.now()
    const duration = this.touchEndTime - this.touchStartTime
    this.bottle.velocity.vx = (Math.min(duration / 6, 400)).toFixed(2)
    this.bottle.velocity.vy = (Math.min(150 + duration / 20, 400)).toFixed(2)

    // 停止压缩，恢复状态为stop，并且压缩量重新恢复为1
    this.bottle.stop()
    this.bottle.scale = 1

    // 恢复block状态
    this.currentBlock.rebound()

    // 将小瓶状态改为跳跃
    this.bottle.jump()

    // 计算小瓶下压的高度
    const initY = blockConf.height - (1 - this.bottle.scale.y) * blockConf.height
    this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, initY)
  }

  setDirection(direction) {
    const currentPossition = {
      x: this.bottle.obj.position.x,
      z: this.bottle.obj.position.z
    }

    this.axis = new THREE.Vector3(
      this.targetPosition.x - currentPossition.x,
      0,
      this.targetPosition.z - currentPossition.z
    )
    // 将向量约分
    this.axis.normalize()
    this.bottle.setDirection(direction, this.axis)
  }

  getHitStatus(bottle, currentBlock, nextBlock, initY) {
    // flyingTime是上抛运动在同一水平线上的总时间
    let flyingTime = bottle.velocity.vy / gameConf.gravity * 2
    initY = initY || _bottle.obj.position.y.toFixed(2)
    // time为水平方向上，小瓶起跳点与落脚点之间的距离，小瓶落下这段距离所需要的时间
    var time = +((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * initY * gameConf.gravity)) / gameConf.gravity).toFixed(2)
    // flyingTime 与 time 相减后，小瓶在空中的总的飞行时间
    flyingTime = (flyingTime - time).toFixed(2)
  }
}