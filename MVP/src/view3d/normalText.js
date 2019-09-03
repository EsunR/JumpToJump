// 工厂模式
import font from './font';

export default class NormalText {
  constructor() {

  }

  init(options) {
    this.material = new THREE.MeshBasicMaterial({
      color: (options && options.fillStyle) ? options.fillStyle : 0xffffff,
      transparent: true
    })
    if (options && options.opacity) {
      this.material.opacity = options.opacity
    }
    this.options = options || {}
    const geometry = new THREE.TextGeometry('', {
      "font": font,
      "size": options.size,
      "height": options.height
    })
    this.instance = new THREE.Mesh(geometry, this.material)
    this.instance.name = 'normalText'
  }

  updateText(text) {
    const textString = text.toString()
    const geometry = new THREE.TextGeometry(textString, {
      "font": font,
      "size": options.size,
      "height": options.height
    })
    this.instance = new THREE.Mesh(geometry, this.material)
  }
}