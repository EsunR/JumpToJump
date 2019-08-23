import * as THREE from '../libs/three'
window.THREE = THREE
THREE.AxesHelper = THREE.AxisHelper
import game from './game/game';

class Main {
  constructor() {

  }

  static init() {
    game.init()
  }
}


export default Main
