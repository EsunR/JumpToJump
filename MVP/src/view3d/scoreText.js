// 工厂模式
import font from './font';

export default class ScoreText {
  constructor() {
    this.fillStyle = 0xffffff
    this.size = 6.0
    this.height = 0.1
    this.defaultText = "0"
    this.opacity = true
  }

  init(options) {
    // options可传入参数：fillStyle opacity size height
    if (options) {
      for (let key in options) {
        this[key] = options[key]
      }
      this.options = options
    } else {
      this.options = {}
    }

    this.material = new THREE.MeshBasicMaterial({
      color: this.fillStyle,
      transparent: true
    })
    this.material.opacity = this.opacity
    const geometry = new THREE.TextGeometry(this.defaultText, {
      "font": font,
      "size": this.size,
      "height": this.height
    })
    this.instance = new THREE.Mesh(geometry, this.material)
    this.instance.name = 'scoreText'
  }

  updateScore(score) {
    const scoreStr = score.toString()
    this.instance.geometry = new THREE.TextGeometry(scoreStr, {
      "font": font,
      "size": this.size,
      "height": this.height
    })
  }

  reset() {
    this.instance.geometry = new THREE.TextGeometry(this.defaultText, {
      "font": font,
      "size": this.size,
      "height": this.height
    })
  }
}