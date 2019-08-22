export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init(options) {
    this.initGameOverCanvas(options)
  }

  initGameOverCanvas(options) {
    // 获取在 game-page.js 中定义的场景
    this.scene = options.scene

    // 计算长宽比
    const aspect = window.innerHeight / window.innerWidth

    // 创建一个画布预备当纹理使用
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    // 由一个canvas生成一个纹理
    this.texture = new THREE.Texture(this.canvas)
    this.texture.minFilter = THREE.NearestFilter

    // 由纹理生成一个材质，再将材质贴到一个对象上
    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
      side: THREE.DoubleSide
    })

    // 创建一个平面的几何图形（平面矩形）
    this.geometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight)

    // 由几何形状和材质生成一个网格
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.position.z = 1
    this.obj.rotation.y = Math.PI

    // 绘制内容
    this.context = this.canvas.getContext('2d')
    this.context.fillStyle = '#333'
    this.context.fillRect((window.innerWidth - 200) / 2, (window.innerHeight - 100) / 2, 200, 100)
    this.context.fillStyle = '#eee'
    this.context.font = '20px Georgia'
    this.context.fillText('GameOver', (window.innerWidth - 200) / 2 + 50, (window.innerHeight - 100) / 2 + 55)

    this.texture.needsUpdate = true
    this.scene.add(this.obj)
  }

  show() {
    console.log('game over page show');
  }
}