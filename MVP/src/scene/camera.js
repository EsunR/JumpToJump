import sceneConf from '../config/scene-conf';

class Camera {
  constructor() {
    this.instance = null
  }

  init() {
    // 设置正交相机的上下左右前后
    const aspect = window.innerHeight / window.innerWidth
    this.instance = new THREE.OrthographicCamera(-sceneConf.frustumSize, sceneConf.frustumSize, sceneConf.frustumSize * aspect, -sceneConf.frustumSize * aspect, -100, 85)

    // 设置相机位置
    this.instance.position.set(-10, 10, 10)

    // 设置相机眺望点
    this.target = new THREE.Vector3(0, 0, 0)
    this.instance.lookAt(this.target)
  }

  updatePosition(newTargetPosition) {
    customAnimation.to(this.instance.position, 0.5, { x: newTargetPosition.x - 10, y: newTargetPosition.y + 10, z: newTargetPosition.z + 10 })
    customAnimation.to(this.target, 0.5, { x: newTargetPosition.x, y: newTargetPosition.y, z: newTargetPosition.z })
  }

  reset() {
    this.instance.position.set(-10, 10, 10)
    this.target = new THREE.Vector3(0, 0, 0)
  }
}

export default new Camera()