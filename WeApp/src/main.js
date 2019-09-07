import * as THREE from '../libs/three'
window.THREE = THREE
window.camera = false
import game from './game/game';

class Main {
  constructor() {

  }

  static init() {
    game.init()
  }
}


export default Main
