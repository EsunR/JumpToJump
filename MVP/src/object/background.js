import sceneConf from '../config/scene-conf';

class BackGround {
  constructor() {

  }

  init() {
    const gemmetry = new THREE.PlaneGeometry(
      sceneConf.frustumSize * 2,
      window.innerHeight / window.innerWidth * sceneConf.frustumSize * 2
    )
    const material = new THREE.MeshBasicMaterial({
      color: 0xd7dbe6,
      opacity: 1,
      transparent: true
    })
    this.instance = new THREE.Mesh(gemmetry, material)
  }
}

export default new BackGround()