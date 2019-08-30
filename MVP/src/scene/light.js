class Light {
  constructor() {
    this.instances = {}
  }

  init() {
    var basicMatrial = new THREE.MeshBasicMaterial({ color: 0xF5F5F5 })

    // 环境光
    const ambientLigth = new THREE.AmbientLight(0xffffff, 0.8)
    this.instances.ambientLigth = ambientLigth

    // 平行光
    const shadowLight = new THREE.DirectionalLight(0xffffff, 0.3)
    shadowLight.position.set(10, 30, 20)
    this.shadowTarget = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), basicMatrial) // 设置光的向量
    this.shadowTarget.visible = false;
    shadowLight.name = 'shadowTarget'
    shadowLight.target = this.shadowTarget
    // 使其能够投射阴影
    shadowLight.castShadow = true
    shadowLight.shadow.camera.near = 0.5
    shadowLight.shadow.camera.far = 500
    shadowLight.shadow.camera.left = -100
    shadowLight.shadow.camera.right = 100
    shadowLight.shadow.camera.top = 100
    shadowLight.shadow.camera.bottom = -100
    shadowLight.shadow.mapSize.width = 1024
    shadowLight.shadow.mapSize.height = 1024
    // 挂载实例到 instances 上
    this.instances.shadowLight = shadowLight
  }

  updatePosition(targetPosition) {
    customAnimation.to(this.shadowTarget.position, 0.5, { x: targetPosition.x, y: targetPosition.y, z: targetPosition.z })
    customAnimation.to(this.shadowLight.position, 0.5, { x: 10 + targetPosition.x, y: 30 + targetPosition.y, z: 20 + targetPosition.z })
  }

  reset() {
    this.shadowLight.position.set(10, 30, 20)
    this.shadowTarget.position.set(0, 0, 0)
  }
}

export default new Light()