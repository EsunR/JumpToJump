import { scene } from '../scene/index';
import Cuboid from '../block/cuboid';
import Cylinder from '../block/cylinder';
import bottle from '../object/bottle';
import ground from '../object/ground'
import blockConf from '../config/block-conf';
import gameConf from '../config/game-conf';
import utils from '../utils/index';
import bottleConf from '../config/bottle-conf';
import ScoreText from '../view3d/scoreText';
import audioManager from '../modules/audio-manager';
import { stopAllAnimation } from '../../libs/animation';

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
    this.score = 0
    this.combo = 0 // 跳到中心双倍加分的combo次数
  }

  init() {
    // 对引入的实例进行挂载与初始化
    this.scene = scene
    this.scene.init()

    // 引入、初始化、添加地面到场景中
    this.ground = ground
    this.ground.init()
    this.addGround()

    // 挂载、添加 bottle (先不把bottle添加到场景)
    this.bottle = bottle
    this.bottle.init()

    // 初始化并添加block到场景中
    this.addInitBlock()

    // 挂载、添加分数到场景中
    this.scoreText = new ScoreText()
    this.scoreText.init({
      fillStyle: 0x666699
    })
    this.addScore()

    // 进行场景的渲染
    this.render()
  }

  restart() {
    this.bindTouchEvent() // 绑定点击事件
    this.deleteObjectsfromScene() // 删除场景中的所有物体

    this.scene.reset() // 在scene中去初始化相机和光线的位置
    this.bottle.reset() // 初始化bottle的所有状态
    this.ground.reset() // 初始化地面状态

    this.addInitBlock()
    this.addGround()
    this.addBottle()
  }

  addScore() {
    this.scene.addScore(this.scoreText.instance)
  }

  updateScore(score) {
    // 替换内部文字实例
    this.scoreText.updateScore(score)
  }

  deleteObjectsfromScene() {
    // 获取场景中的一个 block 对象
    let obj = this.scene.instance.getObjectByName('block')
    let count = 0
    while (obj) {
      this.scene.instance.remove(obj)
      if (obj.geometry) {
        obj.geometry.dispose() // 销毁实例化的 geometry 防止内存泄露
      }
      if (obj.material) {
        obj.material.dispose() // 销毁实例化的 material
      }
      // 将对象 obj 迭代为下一个blcok
      obj = this.scene.instance.getObjectByName('block')
      count++
    }
    // 对于已经是实例化的 bottle 和 ground 只是将其移出场景
    this.scene.instance.remove(this.bottle.obj)
    this.scene.instance.remove(this.ground.instance)
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
    // 秒帧都进行画面的重新渲染
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
    canvas.addEventListener('touchstart', this.touchStartCallback)
    canvas.addEventListener('touchend', this.touchEndCallback)
    canvas.addEventListener('touchmove', this.touchMoveCallback)
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchstart', this.touchStartCallback)
    canvas.removeEventListener('touchend', this.touchEndCallback)
    canvas.removeEventListener('touchmove', this.touchMoveCallback)
  }

  touchMoveCallback = (e) => {
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
      if (this.cameraTargetPosition) {
        let { x, y, z } = this.cameraTargetPosition
        camera.lookAt(x, y, z)
      } else {
        camera.lookAt(new THREE.Vector3(0, 0, 0))
      }
    }
  }

  touchStartCallback = (e) => {
    if (window.camera || this.bottle.status !== 'stop') {
      this.lastX = e.touches[0].pageX
      this.lastY = e.touches[0].pageY
      return
    }
    this.touchStartTime = Date.now()
    this.bottle.shrink()
    this.currentBlock.shrink()
    audioManager.shrink.play()
  }

  touchEndCallback = () => {
    if (window.camera || this.bottle.status !== 'shrink') {
      return
    }

    // 开始旋转
    this.bottle.rotate()

    // 计算弹射
    this.touchEndTime = Date.now()
    const duration = this.touchEndTime - this.touchStartTime
    this.bottle.velocity.vx = Number((Math.min(duration * bottleConf.elastic, 400)).toFixed(2))
    this.bottle.velocity.vy = Number((Math.min(150 + duration / 20, 400)).toFixed(2))

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

    // 停止播放音频
    audioManager.shrink.stop()
    audioManager.shrink_end.stop()
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
    initY = initY || Number(bottle.obj.position.y.toFixed(2))

    // time为竖直方向上，小瓶起跳点与落脚点之间的距离，小瓶落下这段距离所需要的时间
    var destinationY = blockConf.height / 2
    var differenceY = destinationY
    var time = Number(((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * gameConf.gravity * differenceY)) / -gameConf.gravity).toFixed(2))
    // flyingTime 与 time 相减后，小瓶在空中的总的飞行时间
    flyingTime = Number((flyingTime - time).toFixed(2))

    // 跳跃目的地的位置
    let destination = this.destination = []
    // 获取小球瓶身在 (x,z) 平面上的二维坐标
    const bottlePossition = new THREE.Vector2(bottle.obj.position.x, bottle.obj.position.z)
    // 将方向向量与移动距离相乘获取变化的距离
    const translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime)
    // 将小球瓶身的坐标与变换的向量相加获取小球瓶身的【预估坐标】
    bottlePossition.add(translate)
    // 缓存向量
    bottle.destination = [Number(bottlePossition.x.toFixed(2)), Number(bottlePossition.y.toFixed(2))]
    destination.push(Number(bottlePossition.x.toFixed(2)), Number(bottlePossition.y.toFixed(2)))

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
    const width = Math.floor(Math.random() * blockConf.width / 2 + 1) + blockConf.width / 2
    const distance = Math.round(Math.random() * 20) + 20
    this.currentBlock = this.nextBlock
    const targetPosition = this.targetPosition = {}
    if (direction === 0) { // 沿着x轴跳跃
      targetPosition.x = this.currentBlock.instance.position.x + distance
      targetPosition.y = this.currentBlock.instance.position.y
      targetPosition.z = this.currentBlock.instance.position.z
    } else if (direction == 1) { // 沿着z轴跳动
      targetPosition.x = this.currentBlock.instance.position.x
      targetPosition.y = this.currentBlock.instance.position.y
      targetPosition.z = this.currentBlock.instance.position.z - distance
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
      y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
      z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
    }
    this.cameraTargetPosition = cameraTargetPosition
    // 通过场景实例来更新相机和光源位置（带动画）
    this.scene.updateCameraPosition(cameraTargetPosition)
    // 通过 ground 实例来更新地面坐标（无需动画）
    this.ground.updatePosition(cameraTargetPosition)
  }

  checkBottleHit() {
    // 当小瓶的高度小于 block 高度的一半 (注意这里高度之所以为一边是因为block的中心点再(x,y)平面上) 且处于飞行状态意味着小瓶已经凉凉
    if (this.bottle.obj.position.y <= blockConf.height / 2 && this.bottle.status === 'jump' && this.bottle.flyingTime > 0.1) {
      this.checkingHit = false
      if (this.hit === HIT_CURRENT_BLOCK || this.hit === HIT_NEXT_BLOCK_NORMAL || this.hit === HIT_NEXT_BLOCK_CENTER) {
        this.bottle.stop()
        this.formatPosition()
        if (this.hit === HIT_NEXT_BLOCK_CENTER || this.hit === HIT_NEXT_BLOCK_NORMAL) {
          if (this.hit === HIT_NEXT_BLOCK_CENTER) {
            this.combo++
            audioManager[`combo${this.combo <= 8 ? this.combo : '8'}`].play()
            this.score += 2 * this.combo
            this.bottle.showAddScore(2 * this.combo) // 瓶身头顶出现 +2*combo 数字
          } else if (this.hit === HIT_NEXT_BLOCK_NORMAL) {
            this.combo = 0
            audioManager.success.play()
            this.score++
            this.bottle.showAddScore(1) // 瓶身头顶出现 +1 数字
          }
          this.updateScore(this.score)
          this.updateNextBlock()
        }
      } else { // game over
        console.log(`掉落点坐标：(${this.bottle.obj.position.x.toFixed(2)}, ${this.bottle.obj.position.y.toFixed(2)}, ${this.bottle.obj.position.z.toFixed(2)})`)
        this.combo = 0
        this.removeTouchEvent()

        // 游戏失败后的动画效果判断
        if (this.hit === GAME_OVER_NEXT_BLOCK_BACK) {
          stopAllAnimation()
          this.formatPosition()
          this.bottle.stop()
          this.bottle.hypsokinesis()
          audioManager.fall_2.play()
          setTimeout(() => {
            this.callbacks.showGameOverPage()
          }, 2000);
        } else if (this.hit === GAME_OVER_NEXT_BLOCK_FRONT || this.hit === GAME_OVER_CURRENT_BLOCK_FRONT) {
          stopAllAnimation()
          this.formatPosition()
          this.bottle.stop()
          this.bottle.forerake()
          audioManager.fall_2.play()
          setTimeout(() => {
            this.callbacks.showGameOverPage()
          }, 2000);
        } else if (this.hit === GAME_OVER_NORMAL) {
          audioManager.fall.play()
          this.bottle.stop()
          this.callbacks.showGameOverPage()
        }
      }
      this.bottle.scatterParticles()
    }
  }

  formatPosition() {
    // 瓶身坐标规范
    this.bottle.obj.position.set(this.destination[0], bottleConf.horizontalHeight, this.destination[1])
    this.bottle.obj.rotation.set(0, 0, 0)
  }
}