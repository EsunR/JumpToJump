import sceneConf from '../config/scene-conf';

export default class GameStartPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init(options) {
    this.initGameStartCanvas(options)
  }

  initGameStartCanvas(options) {
    // 创建2d
    const aspect = window.innerHeight / window.innerWidth
    this.camera = options.scene.camera.instance
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    let context = this.context = this.canvas.getContext('2d')

    // 将2d画布作为纹理贴到创建的平面上，并将平面移至摄像机位置前
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true })
    this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2)
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.position.z = 60

    // 绘制背景
    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制标题
    let titleImage = wx.createImage()
    titleImage.src = 'res/images/title.png'
    titleImage.onload = () => {
      let imgAspect = titleImage.height / titleImage.width
      context.drawImage(
        titleImage,
        this.canvas.width * 0.15,
        this.canvas.height * 0.15,
        this.canvas.width * 0.7,
        this.canvas.width * 0.7 * imgAspect
      )
      this.texture.needsUpdate = true
    }

    // 绘制按钮
    let startBtn = wx.createImage()
    startBtn.src = 'res/images/play.png'
    startBtn.onload = () => {
      let imgAspect = startBtn.height / startBtn.width
      context.drawImage(
        startBtn,
        this.canvas.width * 0.25,
        this.canvas.height * 0.6,
        this.canvas.width * 0.5,
        this.canvas.width * 0.5 * imgAspect
      )
      this.texture.needsUpdate = true
      // 设置按钮触碰区域
      this.startBtnRegion = [
        this.canvas.width * 0.25, this.canvas.width * 0.25 + this.canvas.width * 0.5, // 水平范围
        this.canvas.height * 0.6, this.canvas.height * 0.6 + this.canvas.width * 0.5 * imgAspect // 竖直范围
      ]
    }

    // 检测用户点击
    this.bindTouchEvent()


    this.camera.add(this.obj)
  }

  show() {
    console.log('show gameStart Page');
  }

  hide() {
    this.obj.visible = false
    this.removeTouchEvent()
  }

  bindTouchEvent() {
    window.addEventListener('touchstart', this.startGame)
  }

  removeTouchEvent() {
    window.removeEventListener('touchstart', this.startGame)
  }

  startGame = (e) => {
    const pageX = e.changedTouches[0].pageX
    const pageY = e.changedTouches[0].pageY
    console.log(this.startBtnRegion);
    if (pageX > this.startBtnRegion[0] && pageX < this.startBtnRegion[1] && pageY > this.startBtnRegion[2] && pageY < this.startBtnRegion[3]) {
      this.callbacks.gameRestart()
    }
  }
}