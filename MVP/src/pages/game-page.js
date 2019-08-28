import { scene } from '../scene/index';
import Cuboid from '../block/cuboid';
import Cylinder from '../block/cylinder';
import bottle from '../object/bottle';
import ground from '../object/ground'

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init() {
    // 对引入的实例进行挂载与初始化
    this.scene = scene
    this.scene.init()

    // 引入、初始化、添加地面到场景中
    this.ground = ground
    this.ground.init()
    this.addGround()

    // 初始化并添加blck到场景中
    this.addInitBlock()

    // 挂载、添加 bottle 到场景中
    this.bottle = bottle
    this.bottle.init()
    this.addBottle()

    // 绑定点击事件
    this.bindTouchEvent()

    // 进行场景的渲染
    this.render()
  }

  render() {
    this.scene.render()
    if (this.bottle) {
      this.bottle.update()
    }
    requestAnimationFrame(this.render.bind(this))
  }

  addInitBlock() {
    const cuboidBlock = new Cuboid(-15, 0, 0)
    const cylinderBlock = new Cylinder(23, 0, 0)
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)
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
    this.bottle.rotate()
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchstart', this.touchStartCallback)
    canvas.removeEventListener('touchend', this.touchEndCallback)
  }

  touchStartCallback() {
    console.log('touch start');
  }

  touchEndCallback() {
    console.log('touch end');
  }
}