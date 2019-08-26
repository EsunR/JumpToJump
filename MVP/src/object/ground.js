class Ground {
  constructor() {
  }

  init() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const material = new THREE.ShadowMaterial({
      transparent: true
    })
    material.opacity = 0.2

    this.instance = new THREE.Mesh(groundGeometry, material)

    // 让地面可以接收阴影
    this.instance.receiveShadow = true

    // 设置地面位置
    this.instance.rotation.x = -Math.PI / 2
    this.instance.position.y = - 16 / 3.2
  }
}

export default new Ground()