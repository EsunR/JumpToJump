export default class GameOverPage {
  constructor(callbacks) {
    this.callbacks = callbacks
  }

  init(options) {
    this.initGameOverCanvas(options)
  }

  initGameOverCanvas(options) {
    
  }

  show() {
    this.obj.visible = true
  }

  hide() {
    this.obj.visible = false
  }
}