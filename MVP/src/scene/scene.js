import camera from './camera';
import light from './light';
import background from '../object/background';
import sceneConf from '../config/scene-conf';

class Scene {
  constructor() {
    this.instance = null
    this.currentScore = null
    this.sceneWidth = sceneConf.frustumSize * 2,
      this.sceneHeight = window.innerHeight / window.innerWidth * sceneConf.frustumSize * 2
  }

  init() {
    // 初始化一个场景实例
    this.instance = new THREE.Scene
    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      // 开启抗锯齿
      antialias: true,
      preserveDrawingBuffer: true
    })
    // 在场景中渲染阴影
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap


    // 将相机实例引入并进行初始化
    this.camera = camera
    this.camera.init()
    this.instance.add(this.camera.instance)

    // 加入背景
    this.background = background
    this.background.init()
    this.background.instance.position.z = -84

    // 背景要时刻显示在相机直视的位置，所以将背景添加到相机上
    this.camera.instance.add(this.background.instance)

    // 引入并初始化光线
    this.light = light
    this.light.init()
    // 循环遍历，将所有的光类型都添加到场景中去
    for (let lightType in this.light.instances) {
      this.instance.add(this.light.instances[lightType])
    }

    // 创建一个 axesHelper 添加到场景中
    this.axesHelper = new THREE.AxesHelper(100)
    this.instance.add(this.axesHelper)
  }

  reset() {
    this.camera.reset()
    this.light.reset()
  }

  render() {
    this.renderer.render(this.instance, this.camera.instance)
  }

  updateCameraPosition(targetPosition) {
    this.camera.updatePosition(targetPosition)
    this.light.updatePosition(targetPosition)
  }

  addScore(scoreInstance) {
    // 提供给外部调用，将传入的分数实例添加到场景中
    this.currentScore = scoreInstance
    this.camera.instance.add(scoreInstance)
    scoreInstance.position.x = 10 - this.sceneWidth / 2
    scoreInstance.position.y = this.sceneHeight / 2 - 15
  }

  updateScore(scoreInstance) {
    // 移除分数实例
    this.camera.instance.remove(this.currentScore)
    // 添加更新过的分数实例，实现视图的更新
    this.addScore(scoreInstance)
  }
}

export default new Scene()