import scenConf from '../config/scene-conf';

export default class GameStartPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init(options) {
    this.initGameStartCanvas(options)
  }

  initGameStartCanvas(options) {
    const aspect = window.innerHeight / window.innerWidth
    this.camera = options.scene.camera.instance
    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  gameStartPage() {
    console.log('show gameStart Page');
  }
}