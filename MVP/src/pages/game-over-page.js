import sceneConf from '../config/scene-conf'

export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  show(newScore) {
    this.obj.visible = true
    this.newScore = newScore
    this.drawCanvas()
    this.bindTouchEvent()
  }

  hide() {
    this.obj.visible = false
    this.removeTouchEvent()
  }

  init(options) {
    this.initGameoverCanvas(options)
  }

  initGameoverCanvas(options) {
    const aspect = window.innerHeight / window.innerWidth
    this.region = [
      (window.innerWidth - 200) / 2,
      (window.innerWidth - 200) / 2 + 200,
      (window.innerHeight - 100) / 2,
      (window.innerHeight - 100) / 2 + 100
    ]
    this.camera = options.scene.camera.instance
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true });
    this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2)
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.visible = false
    this.obj.position.z = 20
    this.context = this.canvas.getContext('2d')
    this.obj.visible = false
    this.camera.add(this.obj)
  }

  onTouchEnd = (e) => {
    const pageX = e.changedTouches[0].pageX
    const pageY = e.changedTouches[0].pageY
    if (pageX > this.region[0] && pageX < this.region[1] && pageY > this.region[2] && pageY < this.region[3]) { // restart
      this.callbacks.gameRestart()
    }
  }

  bindTouchEvent() {
    canvas.addEventListener('touchend', this.onTouchEnd)
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchend', this.onTouchEnd)
  }

  drawCanvas() {
    // TODO: 绘制分数结算屏
    // 清屏
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight)

    this.context.fillStyle = '#333'
    this.context.fillRect((window.innerWidth - 200) / 2, (window.innerHeight - 100) / 2, 200, 100)
    this.context.fillStyle = '#eee'
    this.context.font = '20px Georgia'
    if (this.newScore) {
      this.context.fillText('历史最高分', (window.innerWidth - 200) / 2 + 50, (window.innerHeight - 100) / 2 + 55)
    } else {
      this.context.fillText('不是历史最高分', (window.innerWidth - 200) / 2 + 50, (window.innerHeight - 100) / 2 + 55)
    }
    this.texture.needsUpdate = true
  }
}