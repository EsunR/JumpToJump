import sceneConf from '../config/scene-conf'
import ScoreText from '../view3d/scoreText';

export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks
    this.newScore = false
    this.height = window.innerHeight
    this.width = window.innerWidth
  }

  show(newScore) {
    this.obj.visible = true
    this.newScore = newScore
    this.drawCanvas()
  }

  hide() {
    this.obj.visible = false
    if (this.scoreText) {
      this.camera.remove(this.scoreText.instance)
    }
    this.removeTouchEvent()
  }

  init(options) {
    this.initGameoverCanvas(options)
  }

  initGameoverCanvas(options) {
    const aspect = window.innerHeight / window.innerWidth
    this.camera = options.scene.camera.instance
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.material = new THREE.MeshBasicMaterial({ map: this.texture, transparent: true });
    this.geometry = new THREE.PlaneGeometry(sceneConf.frustumSize * 2, aspect * sceneConf.frustumSize * 2)
    this.obj = new THREE.Mesh(this.geometry, this.material)
    this.obj.position.z = 80
    this.context = this.canvas.getContext('2d')
    this.obj.visible = false
    this.camera.add(this.obj)
  }

  removeTouchEvent() {
    canvas.removeEventListener('touchend', this.rePlayClick)
  }

  drawCanvas() {
    // 获取分数数据
    this.highScore = window.localStorage.getItem("HighScore")
    this.currentScore = window.localStorage.getItem("CurrentScore")

    // 清屏
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.context.fillRect(0, 0, this.width, this.height)

    // 设置全局文字
    this.context.font = "15px Microsoft YaHei";
    this.context.fillStyle = "rgba(255,255,255, 0.8)"
    this.context.textAlign = "center"


    if (this.newScore) {
      // 绘制历史最高分界面
      let highScoreImg = wx.createImage()
      highScoreImg.src = "res/images/high_score.png"
      highScoreImg.onload = () => {
        let scale = highScoreImg.height / highScoreImg.width
        let width = Math.min(414, this.width * 0.8)
        this.context.drawImage(
          highScoreImg,
          (this.width - width) / 2,
          this.height * 0.11,
          width,
          width * scale
        )
        this.texture.needsUpdate = true
      }
    } else {
      // 绘制非历史最高分
      this.context.fillText("= 本次得分 =", this.width / 2, this.height * 0.2)
    }

    // 绘制本次分数
    this.scoreText = new ScoreText()
    this.scoreText.init({
      fillStyle: 0xffffff,
      defaultText: this.currentScore.toString()
    })
    this.scoreText.instance.position.x = -2
    this.scoreText.instance.position.y = (sceneConf.frustumSize * 2 * this.height / this.width) * 0.15
    this.scoreText.instance.position.z = 81
    this.camera.add(this.scoreText.instance)

    // 绘制功能按钮
    let replayBtn = wx.createImage()
    replayBtn.src = 'res/images/replay.png'
    replayBtn.onload = () => {
      let scale = replayBtn.height / replayBtn.width
      let dx = this.width * 0.25
      let dy = this.height * 0.7
      let dw = this.width * 0.5
      let dh = this.width * 0.5 * scale
      this.context.drawImage(replayBtn, dx, dy, dw, dh)
      // 设定按钮点按区域
      this.replayBtnRegin = {
        left: dx,
        right: dx + dw,
        top: dy,
        bottom: dy + dh
      }
      // 绑定事件
      window.addEventListener("touchend", this.rePlayClick)
      this.texture.needsUpdate = true
    }

    // 绘制历史最高分
    this.context.fillText(
      `历史最高分：${this.highScore}`,
      this.width / 2,
      this.height * 0.9
    )
    this.texture.needsUpdate = true
  }

  rePlayClick = (e) => {
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    if (x > this.replayBtnRegin.left && x < this.replayBtnRegin.right && y > this.replayBtnRegin.top && y < this.replayBtnRegin.bottom) {
      this.callbacks.gameRestart()
    }
  }
}