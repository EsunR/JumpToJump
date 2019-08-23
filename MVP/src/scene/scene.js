import camera from './camera';

class Scene {
  constructor() {
    this.instance = null
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

    // 将相机实例引入并进行初始化
    this.camera = camera
    this.camera.init()

    // 相机添加到当前场景中
    this.instance.add(this.camera.instance)

    // 创建一个 axesHelper 添加到场景中
    this.axesHelper = new THREE.AxesHelper(100)
    this.instance.add(this.axesHelper)
  }

  render() {
    this.renderer.render(this.instance, this.camera.instance)
  }
}

export default new Scene()