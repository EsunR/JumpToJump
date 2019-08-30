import { scene } from '../scene/index';
import Cuboid from '../block/cuboid';
import Cylinder from '../block/cylinder';
import bottle from '../object/bottle';
import ground from '../object/ground'
import blockConf from '../config/block-conf';
import gameConf from '../config/game-conf';
import utils from '../utils/index';
import bottleConf from '../config/bottle-conf';

// 规定跳跃后的状态
const GAME_OVER_NORMAL = 0
const HIT_NEXT_BLOCK_CENTER = 1
const HIT_CURRENT_BLOCK = 2
const GAME_OVER_NEXT_BLOCK_BACK = 3
const GAME_OVER_CURRENT_BLOCK_FRONT = 4
const GAME_OVER_NEXT_BLOCK_FRONT = 5
const GAME_OVER_BOTH = 6
const HIT_NEXT_BLOCK_NORMAL = 7

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
    this.targetPosition = {}
    this.checkingHit = false
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
      if (this.checkingHit) {
        // 监测 bottle 是否触碰到下一个block
        this.checkBottleHit()
      }
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
    console.log(window.camera);
    if (window.camera) {
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
    if (window.camera) {
      this.lastX = e.touches[0].pageX
      this.lastY = e.touches[0].pageY
      return
    }
    this.touchStartTime = Date.now()
    this.bottle.shrink()
    this.currentBlock.shrink()
  }

  touchEndCallback() {
    if (window.camera) {
      return
    }

    // 开始旋转
    this.bottle.rotate()

    // 计算弹射
    this.touchEndTime = Date.now()
    const duration = this.touchEndTime - this.touchStartTime
    this.bottle.velocity.vx = (Math.min(duration * bottleConf.elastic, 400)).toFixed(2)
    this.bottle.velocity.vy = (Math.min(150 + duration / 20, 400)).toFixed(2)

    // 停止压缩，恢复状态为stop，并且压缩量重新恢复为1
    this.bottle.stop()
    this.bottle.scale = 1

    // 恢复block状态
    this.currentBlock.rebound()

    // 将小瓶状态改为跳跃
    this.bottle.jump()

    // 计算小瓶下压后的Y轴坐标
    const initY = blockConf.height / 2 - (1 - this.currentBlock.instance.scale.y) * blockConf.height

    // 预判断该次跳跃后的碰撞状态
    this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, initY)
    this.checkingHit = true // render过程开始监视小瓶状态
    console.log("预判断碰撞状态：", this.hit);
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

    // initY是小瓶下压后的Y轴坐标，也就是小瓶起跳时的Y轴坐标
    initY = initY || bottle.obj.position.y.toFixed(2)

    // time为竖直方向上，小瓶起跳点与落脚点之间的距离，小瓶落下这段距离所需要的时间
    var destinationY = blockConf.height / 2
    var differenceY = destinationY
    var time = ((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * gameConf.gravity * differenceY)) / -gameConf.gravity).toFixed(2)
    // flyingTime 与 time 相减后，小瓶在空中的总的飞行时间
    flyingTime = (flyingTime - time).toFixed(2)

    // 跳跃目的地的位置
    let destination = []
    // 获取小球瓶身在 (x,z) 平面上的二维坐标
    const bottlePossition = new THREE.Vector2(bottle.obj.position.x, bottle.obj.position.z)
    // 将方向向量与移动距离相乘获取变化的距离
    const translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime)
    // 将小球瓶身的坐标与变换的向量相加获取小球瓶身的【预估坐标】
    bottlePossition.add(translate)
    // 缓存向量
    bottle.destination = [bottlePossition.x.toFixed(2), bottlePossition.y.toFixed(2)]
    destination.push(bottlePossition.x.toFixed(2), bottlePossition.y.toFixed(2))

    const bodyWidth = 1.8141 * bottleConf.headRadius

    if (nextBlock) {
      // 计算小瓶落点与 block 中心点的距离差值的平方
      const nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2)

      // 首先检测小瓶会不会触碰到下一个 block 的顶部平面
      const nextPolygon = nextBlock.getVertices()
      let result1
      // 以射线法计算某一点是否在多边形内部
      // 如果落脚点在系一个block上平面上
      if (utils.pointInPolygon(destination, nextPolygon)) {
        if (Math.abs(nextDiff) < 5) {
          // 落到平面中心
          result1 = HIT_NEXT_BLOCK_CENTER
        } else {
          // 落到平面上
          result1 = HIT_NEXT_BLOCK_NORMAL
        }
      }
      // 如果不在
      else if (utils.pointInPolygon([destination[0] - bodyWidth / 2, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + bodyWidth / 2], nextPolygon)) {
        result1 = GAME_OVER_NEXT_BLOCK_FRONT
      } else if (utils.pointInPolygon([destination[0], destination[1] - bodyWidth / 2], nextPolygon) || utils.pointInPolygon([destination[0] + bodyWidth / 2, destination[1]], nextPolygon)) {
        result1 = GAME_OVER_NEXT_BLOCK_BACK
      }

      // 如果没有触碰到下一个方块，则检测是否碰触到当前的方块
      const currentPolygon = currentBlock.getVertices()
      let result2
      if (utils.pointInPolygon(destination, currentPolygon)) {
        result2 = HIT_CURRENT_BLOCK
      } else if (utils.pointInPolygon([destination[0] - bodyWidth / 2, destination[1]], currentPolygon) || utils.pointInPolygon([destination[0], destination[1] + bodyWidth / 2], currentPolygon)) {
        if (result1) {
          result2 = GAME_OVER_BOTH
        } else {
          result2 = GAME_OVER_CURRENT_BLOCK_FRONT
        }
      }

      console.log(`下一个方块的最远边缘：${nextPolygon[0]}，预估落地点：(${destination})`);
      return result1 || result2 || GAME_OVER_NORMAL
    }
  }

  updateNextBlock() {
    const seed = Math.round(Math.random())
    const type = seed ? 'cuboid' : 'cylinder'
    const direction = Math.round(Math.random()) // 0 -> x 1-> y
    const width = Math.round(Math.random() * 12) + 8
    const distance = Math.round(Math.random() * 20) + 20
    this.currentBlock = this.nextBlock
    const targetPosition = this.targetPosition = {}
    if (direction === 0) { // 沿着x轴跳跃
      targetPosition.x = this.currentBlock.instance.x + distance
      targetPosition.y = this.currentBlock.instance.y
      targetPosition.z = this.currentBlock.instance.z
    } else if (direction == 1) { // 沿着z轴跳动
      targetPosition.x = this.currentBlock.instance.x
      targetPosition.y = this.currentBlock.instance.y
      targetPosition.z = this.currentBlock.instance.z - distance
    }
    this.setDirection(direction)
    if (type === 'cuboid') {
      this.nextBlock = new Cuboid(targetPosition.x, targetPosition.y, targetPosition.z, width)
    } else {
      this.nextBlock = new Cylinder(targetPosition.x, targetPosition.y, targetPosition.z, width)
    }
    this.scene.instance.add(this.nextBlock.instance)
    const cameraTargetPosition = {
      x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
      y: (this.currentBlock.instance.position.y + this.neytBlock.instance.position.y) / 2,
      z: (this.currentBlock.instance.position.z + this.neztBlock.instance.position.z) / 2,
    }
    this.scene.updateCameraPosition(cameraTargetPosition)
    this.ground.updatePosition(cameraTargetPosition)
  }

  checkBottleHit() {
    // 当小瓶的高度小于 block 高度的一半 (注意这里高度之所以为一边是因为block的中心点再(x,y)平面上) 且处于飞行状态意味着小瓶已经凉凉
    if (this.bottle.obj.position.y <= blockConf.height / 2 && this.bottle.status === 'jump' && this.bottle.flyingTime > 0.1) {
      if (this.hit === HIT_CURRENT_BLOCK || this.hit === HIT_NEXT_BLOCK_NORMAL || this.hit === HIT_NEXT_BLOCK_CENTER) {
        this.bottle.stop()
        this.bottle.obj.position.x = this.bottle.destination[0]
        this.bottle.obj.position.y = bottleConf.horizontalHeight
        this.bottle.obj.position.z = this.bottle.destination[1]
        this.checkingHit = false
        if (this.hit === HIT_NEXT_BLOCK_CENTER || this.hit === HIT_NEXT_BLOCK_NORMAL) {
          this.updateNextBlock()
        }
      } else { // game over
        console.log(`掉落点坐标：(${this.bottle.obj.position.x.toFixed(2)}, ${this.bottle.obj.position.y.toFixed(2)}, ${this.bottle.obj.position.z.toFixed(2)})`)
        this.bottle.stop()
        this.removeTouchEvent()
        this.callbacks.showGameOverPage()
        this.checkingHit = false
      }
    }
  }
}