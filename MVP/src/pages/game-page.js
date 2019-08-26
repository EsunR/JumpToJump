import { scene } from '../scene/index';
import Cuboid from '../block/cuboid';
import Cylinder from '../block/cylinder';
import ground from '../object/ground'

export default class GamePage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init() {
    // 对引入的实例进行挂载与初始化
    this.scene = scene
    this.scene.init()
    this.ground = ground
    this.ground.init()

    this.addInitBlock()


    this.render()
  }

  render() {
    this.scene.render()
    requestAnimationFrame(this.render.bind(this))
  }

  addInitBlock() {
    const cuboidBlock = new Cuboid(-15, 0, 0)
    const cylinderBlock = new Cylinder(23, 0, 0)
    this.scene.instance.add(cuboidBlock.instance)
    this.scene.instance.add(cylinderBlock.instance)
  }

  addGround(){
    this.scene.instance.add(this.ground.instance)
  }
}