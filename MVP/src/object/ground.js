class Ground {
  constructor() {
  }

  init() {
    const groundGeometry = new THREE.PlaneGeometry(200, 200)
    const material = new THREE.ShadowMaterial({
      // transparent为true才能设置阴影
      transparent: true,
      color: 0x000000,
      opacity: 0.3
    })

    this.instance = new THREE.Mesh(groundGeometry, material)
    // 让地面可以接收阴影
    this.instance.receiveShadow = true
    this.instance.rotation.x = -Math.PI / 2
    this.instance.position.y = - 16 / 3.2
  }
}

export default new Ground()